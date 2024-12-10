const axios = require('axios');
const FormData = require('form-data');


// catalogoController.js (Cliente)
exports.getCatalogo = async (req, res, next) => {
    try {
        console.log("Iniciando solicitud para obtener el catálogo...");

        // Verifica que el token esté presente
        if (!req.cookies.jwt) {
            throw new Error('Token no presente en las cookies');
        }

        const response = await fetch(`${process.env.pathApi}/get-catalogo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.cookies.jwt}`
            },
            credentials: 'include'
        });

        // Manejo de respuesta 404
        if (response.status === 404) {
            console.log("El catálogo está vacío.");
            return res.render('catalogo', { productos: [], mensaje: 'No hay productos disponibles en el catálogo.' });
        }

        if (!response.ok) {
            throw new Error(`Error en la solicitud de catálogo: ${response.statusText}`);
        }

        const productos = await response.json();
        console.log("Productos obtenidos del API:", productos);

        // Manejo del catálogo vacío
        if (!productos || productos.length === 0) {
            console.log("No hay productos disponibles.");
            return res.render('catalogo', { productos: [], mensaje: 'No hay productos disponibles en el catálogo.' });
        }

        res.locals.productos = productos;

        console.log("Renderizando la vista con productos...");
        res.render('catalogo', { productos: res.locals.productos, mensaje: null });
    } catch (error) {
        console.error('Error al obtener el catálogo:', error.message);
        next(error);
    }
};






exports.getAll = async (req, res, next) => {
    try {
        console.log('Iniciando solicitud a la API de catálogo...');
        const response = await fetch(`${process.env.pathApi}/get-all`);
        
        if (!response.ok) {
            console.log('Error en la respuesta de la API:', response.status, response.statusText);
            
            // Si el estado es 404, asumimos que no hay productos en la tabla
            if (response.status === 404) {
                console.log('El catálogo está vacío.');
                res.locals.catalogo = []; // Pasamos un array vacío si no hay productos
                return next(); // Continuamos sin lanzar un error
            }

            throw new Error('Error al obtener el catálogo: ' + response.statusText);
        }

        const catalogo = await response.json();

        // Asegúrate de que lo que se recibe es un array
        if (!Array.isArray(catalogo)) {
            throw new Error('El catálogo no tiene el formato esperado.');
        }

        res.locals.catalogo = catalogo;
        next(); // Continua con la siguiente función de middleware

    } catch (error) {
        console.error('Error al consumir el catálogo:', error.message);
        next(error); // Pasar el error al manejador de errores
    }
};





// uploadController.js


exports.addProduct = async (req, res) => {
    const { nombre_producto, descripcion, id_curso, link } = req.body;
    const imagen_producto = req.file; // Información del archivo subido

    // Verificar si se ha cargado la imagen
    if (!imagen_producto) {
        return res.status(400).json({ success: false, message: 'No se ha subido ninguna imagen' });
    }

    try {
        const form = new FormData();
        form.append('file', imagen_producto.buffer, { filename: imagen_producto.originalname });
        form.append('nombre_producto', nombre_producto);
        form.append('descripcion', descripcion);
        form.append('id_curso', id_curso);
        form.append('link', link);

        const headers = form.getHeaders();

        const response = await axios.post(`${process.env.pathApi}/add-producto`, form, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
            }
        });

        res.redirect('/catalogoAdmin');
    } catch (error) {
        console.error('Error al enviar la imagen y datos al servidor externo:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Error al agregar el producto' });
    }
};



exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const url = `${process.env.pathApi}/delete-producto/${id}`;

        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, Response: ${await response.text()}`);
        }

        res.json({ message: 'Estudiante eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}


exports.actualizarProducto = async (req, res) => {
    const { id_catalogo, nombre_producto, descripcion, id_curso, link } = req.body;
    const imagen_producto = req.file; // Información del archivo subido

    if (!id_catalogo) {
        return res.status(400).json({ success: false, message: 'ID del catálogo es requerido' });
    }

    try {
        // Crear una instancia de FormData
        const form = new FormData();
        if (imagen_producto) {
            form.append('file', imagen_producto.buffer, { filename: imagen_producto.originalname });
        }
        form.append('nombre_producto', nombre_producto);
        form.append('descripcion', descripcion);
        form.append('id_curso', id_curso);
        form.append('link', link);

        // Configurar los encabezados de la solicitud, incluyendo los encabezados generados por form-data
        const headers = form.getHeaders();

        // Enviar los datos y la imagen a un servidor externo
        const response = await axios.put(`${process.env.pathApi}/update-producto/${id_catalogo}`, form, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
            }
        });

        // Procesar la respuesta del servidor y redirigir al cliente
        res.redirect('/catalogoAdmin');
    } catch (error) {
        console.error('Error al enviar la imagen y datos al servidor externo:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
    }
};