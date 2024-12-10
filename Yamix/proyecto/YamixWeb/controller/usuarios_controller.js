const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

exports.addDocument = async (req, res) => {
    console.log("hola")
    const { id_usuario } = req.body;
    const documentos = req.files; // Los archivos subidos estarán en un array llamado req.files

    // Verificar si se han cargado documentos
    if (!documentos || documentos.length === 0) {
        return res.status(400).json({ success: false, message: 'No se ha subido ningún documento' });
    }

    try {
        // Imprimir los archivos recibidos para verlos en consola
        console.log('Archivos recibidos:', documentos);

        // Procesar cada documento subido
        for (let documento of documentos) {
            console.log(`Procesando archivo: ${documento.originalname}`); // Nombre del archivo

            const form = new FormData();

            // Cambiar el nombre del campo a 'file' si es lo que el servidor espera
            form.append('documento', documento.buffer, documento.originalname); // Asegúrate de que el nombre del campo sea correcto
            form.append('id_usuario', id_usuario);

            const headers = form.getHeaders();
            
            console.log('Encabezados del FormData:', headers); // Mostrar los encabezados para verificar que se estén generando correctamente

            // Enviar los datos al servidor externo
            const response = await axios.post(`${process.env.pathApi}/add-documento`, form, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Mostrar la respuesta de la API externa
            console.log('Respuesta del servidor externo:', response.data);
        }

        // Redirigir al catálogo después de agregar los documentos
        console.log('Documentos enviados correctamente, redirigiendo...');
        res.redirect('/usuariosAdmin');
    } catch (error) {
        // Manejo de errores con más detalle
        console.error('Error al enviar los documentos al servidor externo:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Error al agregar los documentos' });
    }
};



// Traer usuarios desde la API
exports.traer = async (req, res, next) => {
    try {
        // Extraer el id del usuario desde el JWT
        const { id } = req.usuario; // Aquí estamos obteniendo el id del usuario desde el token decodificado
        
        // Traer usuarios
        const responseUsuarios = await fetch(`${process.env.pathApi}/traer_usuarios`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (!responseUsuarios.ok) throw new Error(`Error en la API de usuarios: ${responseUsuarios.statusText}`);
        const dataUsuarios = await responseUsuarios.json();
        
        // Traer roles
        const responseRoles = await fetch(`${process.env.pathApi}/traer_roles`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (!responseRoles.ok) throw new Error(`Error en la API de roles: ${responseRoles.statusText}`);
        const dataRoles = await responseRoles.json();
        
        // Almacenar los datos en res.locals
        res.locals.data = dataUsuarios; // Usuarios
        res.locals.roles = dataRoles;    // Roles
        res.locals.usuarioId = id;      // ID del usuario desde el token

        next();
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).send('Error interno del servidor');
    }
};




// Traer usuarios en estado de espera desde la API
exports.traerEspera = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/usuariosEspera`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, // Autenticación JWT si es necesario
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);

        const data = await response.json();
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener usuarios en espera:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Agregar usuario
exports.agregarUsuario = async (req, res, next) => {
    try {
        const usuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            fecha_nacimiento: req.body.fecha_nacimiento,
            correo: req.body.correo, // Asegúrate de que sea 'correo'
            contraseña: req.body.contrasena, // Asegúrate de que sea 'contrasena'
            id_rol: req.body.id_rol,
            estado: req.body.estado,
            pagos: req.body.fecha_pagado || null // Enviar la fecha si existe, si no, null
        };

        console.log('Datos del usuario:', usuario); // Verificar datos enviados

        const response = await fetch(`${process.env.pathApi}/agregar_usuario`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error en la API:', errorData);
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();
        res.locals.data = data;
        next();
        // Usar el encabezado Referer para redirigir a la vista anterior
        const previousUrl = req.get('Referer') || '/usuariosAdmin'; // Fallback a '/usuariosAdmin' si no hay Referer
        res.redirect(previousUrl);
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};




// Obtener un usuario por su ID
exports.obtenerUsuarioPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const response = await fetch(`${process.env.pathApi}/obtener_usuario/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, // Autenticación JWT si es necesario
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);

        const data = await response.json();
        res.locals.usuario = data;
        next();
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Editar usuario
exports.editarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/editar_usuario/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, // Autenticación JWT si es necesario
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        // Revisar si la respuesta de la API no es satisfactoria
        if (!response.ok) {
            const errorData = await response.json(); // Obtener el cuerpo del error
            const errorMessage = errorData.error || `Error en la API: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Usar el encabezado Referer para redirigir a la vista anterior
        const previousUrl = req.get('Referer') || '/usuariosAdmin'; // Fallback a '/usuariosAdmin' si no hay Referer
        res.redirect(previousUrl);
    } catch (error) {
        console.error('Error al editar el usuario:', error.message);

        // Enviar el mensaje detallado de error al frontend
        res.status(500).json({ error: error.message || 'Error al editar el usuario' });
    }
};


// Eliminar usuario
exports.eliminarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await fetch(`${process.env.pathApi}/eliminar_usuario/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${req.cookies.jwt}`, // Autenticación JWT si es necesario
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error(`Error en la API: ${response.statusText}`);

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//perfil

exports.obtenerUsuarioCompleto = async (req, res, next) => {
    try {
        // Obtener el token JWT desde las cookies
        const token = req.cookies.jwt;

        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        // Decodificar el token para obtener el id_usuario
        const decoded = jwt.decode(token);
        const id_usuario = decoded.id;



        // Realizar la solicitud al backend usando fetch
        const url = `${process.env.pathApi}/usuario-completo/${id_usuario}`;


        const response = await fetch(url);

        // Verificar si la respuesta fue exitosa (código 200)
        if (!response.ok) {
            throw new Error(`Error al obtener el usuario: ${response.statusText}`);
        }

        // Convertir la respuesta JSON en un objeto JavaScript
        const usuario = await response.json();
        // Guardar los datos del usuario en `req.usuario` para pasarlos a las siguientes funciones/middlewares
        res.locals.usuario = usuario;

        next();
    } catch (error) {
        // Manejar el error si ocurre algún problema en la solicitud
        console.error("Hubo un problema al obtener los datos del usuario:", error);
        res.status(500).send('Error al obtener los datos del usuario');
    }
};




exports.obtenerInasistencias = async (req, res, next) => {
    const token = req.cookies.jwt;
    const decoded = jwt.decode(token);
        const id = decoded.id;
    try {
        // Construye la URL completa utilizando la variable de entorno pathApi
        const url = `${process.env.pathApi}/inasistencias/${id}`;

        // Realiza la solicitud GET al endpoint de las inasistencias
        const response = await fetch(url);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('No se pudo obtener el conteo de inasistencias');
        }

        // Convierte la respuesta a JSON
        const data = await response.json();

        // Devuelve el conteo de inasistencias
        res.locals.inasistencias = data
        next();
    } catch (error) {
        console.error('Error al obtener inasistencias:', error);
        // Manejo de errores, puedes devolver una respuesta de error
        return res.status(500).json({ message: 'Error al obtener las inasistencias' });
    }
};