const { promisify } = require('util');
const jwt = require('jsonwebtoken'); // Asegúrate de tener este paquete para decodificar el token


// Controlador para traer las asistencias y clases y renderizar en la vista
exports.traerAsistencia = async (req, res, next) => {
    try {
        // Realizamos la petición a la API para obtener las asistencias
        const responseAsistencias = await fetch(`${process.env.pathApi}/traer_asistencia`);
        const dataAsistencias = await responseAsistencias.json();

        // Realizamos la petición a la API para obtener las clases
        const responseClases = await fetch(`${process.env.pathApi}/traer_clases`);
        const dataClases = await responseClases.json();

        // Verificamos que ambas peticiones fueron exitosas
        if (responseAsistencias.ok && responseClases.ok) {
            // Pasamos los datos de las asistencias y las clases a res.locals
            res.locals.dataAsistencias = dataAsistencias;
            res.locals.dataClases = dataClases;

            next(); // Continuamos con el siguiente middleware o controlador
        } else {
            console.error('Error al traer asistencias o clases:', dataAsistencias, dataClases);
            res.status(responseAsistencias.status).send(dataAsistencias.message || 'Error al traer las asistencias o clases');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener las asistencias o clases');
    }
};


// Controlador para crear la asistencia
exports.crearAsistencia = async (req, res) => {
    try {
        const { id_clase, fecha_asistencia, estudiantes } = req.body;
        
        // Validar los datos antes de enviarlos
        if (!id_clase || !fecha_asistencia || !Array.isArray(estudiantes) || estudiantes.length === 0) {
            return res.status(400).json({ message: 'Datos incompletos o inválidos.' });
        }

        // Enviar los datos al endpoint de creación de asistencia
        const response = await fetch(`${process.env.pathApi}/crear_asistencia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_clase, fecha_asistencia, estudiantes })
        });

        const data = await response.json();

        if (response.ok) {
            // Redirigir a la vista con un mensaje de éxito
            res.json({ message: 'Asistencia registrada con éxito' }); // Respondemos con un mensaje de éxito
        } else {
            // Renderizar una vista de error o mostrar el mensaje de error
            res.status(response.status).json({ message: data.message || 'Error al crear la asistencia en la API' });
        }
    } catch (error) {
        console.error('Error al crear la asistencia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Traer asistencia del profesor desde la API
exports.traerAsistenciaProfe = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).send('No se ha proporcionado un token');
        }

        const decoded = jwt.decode(token);
        const id_usuario = decoded ? decoded.id : null;

        if (!id_usuario) {
            return res.status(401).send('El token no contiene un ID de usuario válido');
        }

        const responseAsistencias = await fetch(`${process.env.pathApi}/traerAsistenciaProfe/${id_usuario}`);
        const dataAsistencias = await responseAsistencias.json();

        const responseClases = await fetch(`${process.env.pathApi}/traer_clases`);
        const dataClases = await responseClases.json();

        if (responseAsistencias.ok && responseClases.ok) {
            const clasesUsuario = dataClases.filter(clase => clase.id_usuario === id_usuario);

            // Asegurarte de que siempre se renderice la vista
            res.locals.dataAsistencias = dataAsistencias.length > 0 ? dataAsistencias : []; // Si no hay asistencias, un array vacío
            res.locals.dataClases = clasesUsuario;

            next();
        } else {
            console.error('Error al traer asistencias o clases:', dataAsistencias, dataClases);
            res.status(responseAsistencias.status).send(dataAsistencias.message || 'Error al traer las asistencias o clases');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener las asistencias o clases');
    }
};



exports.getAssistancesFromAPI = async (req, res, next) => {
    try {
        // Obtener el token JWT de las cookies
        const token = req.cookies.jwt;

        // Decodificar el token para obtener el id del usuario
        const decoded = jwt.decode(token);
        const id_usuario = decoded ? decoded.id : null;

        if (!id_usuario) {
            return res.status(401).json({
                message: 'No se pudo obtener el ID del usuario del token.'
            });
        }


        // URL de la API para obtener asistencias
        const apiUrl = `${process.env.pathApi}/assistances/${id_usuario}`;

        // Realizar la solicitud a la API
        const response = await fetch(apiUrl);

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({
                message: 'Error al obtener datos de la API.',
                error: error.message || 'Error desconocido.'
            });
        }

        // Procesar la respuesta de la API
        const apiData = await response.json();

        // Guardar los datos en res.locals para usarlos en la vista
        res.locals.data = apiData.data;
        

        next();
    } catch (error) {
        console.error('Error al consumir la API:', error);
        res.status(500).json({
            message: 'Hubo un error al consumir la API.',
            error: error.message
        });
    }
};