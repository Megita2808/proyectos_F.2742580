
const { promisify } = require('util');


exports.obtenerCursos = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_cursos`); // Cambia la URL según tu API
        const cursos = await response.json();

        if (response.ok) {
            res.locals.cursos = cursos;
            next();
        } else {
            console.error('Error al traer cursos:', cursos);
            res.status(response.status).send(cursos.message || 'Error al obtener cursos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener cursos');
    }
};

// Método para obtener todos los profesores desde la API
exports.obtenerProfesores = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_profesores`); // Cambia la URL según tu API
        const profesores = await response.json();

        if (response.ok) {
            res.locals.profesores = profesores;
            next();
            
        } else {
            console.error('Error al traer profesores:', profesores);
            res.status(response.status).send(profesores.message || 'Error al obtener profesores');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener profesores');
    }
};


exports.actualizarClase = async (req, res) => {
    const { id } = req.params;

    console.log('Datos recibidos en el controlador:');
    console.log('ID:', id);
    console.log('Cuerpo de la solicitud (req.body):', req.body);

    try {
        const response = await fetch(`${process.env.pathApi}/actualizar_clase/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        console.log('Respuesta de la API - status:', response.status);

        // Capturar y registrar la respuesta completa (texto o JSON)
        const rawResponse = await response.text();
        console.log('Respuesta de la API - raw:', rawResponse);

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(rawResponse);
            } catch (err) {
                console.error('Error al parsear respuesta como JSON:', rawResponse);
                return res.status(response.status).json({ 
                    success: false, 
                    message: 'Respuesta no válida de la API',
                    details: rawResponse 
                });
            }

            console.error('Error al actualizar la clase:', errorData);
            return res.status(response.status).json({ 
                success: false, 
                message: errorData.message || 'Error al actualizar la clase',
                details: errorData 
            });
        }

        // Si el JSON es válido, continúa
        const result = JSON.parse(rawResponse);
        console.log('Clase actualizada exitosamente:', result);

        res.json({ 
            success: true, 
            message: result.message || 'Clase actualizada exitosamente', 
            data: result 
        });
    } catch (error) {
        console.error('Error interno del servidor:', error.message);

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            details: error.message,
        });
    }
};







exports.traerClases = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/traer_clases`); // Cambia la URL según tu API
        const data = await response.json();

        if (response.ok) {
            res.locals.data = data;
            return next(); // Asegúrate de que llamas a next()
        } else {
            console.error('Error al traer clases:', data);
            return res.status(response.status).send(data.message || 'Error al traer las clases');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        return res.status(500).send('Error al obtener las clases');
    }
};





exports.agregarClase = async (req, res) => {
    try {
        const { hora_inicio, hora_final, id_curso, id_usuario, estado } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ success: false, message: 'id_usuario es requerido' });
        }

        const response = await fetch(`${process.env.pathApi}/agregar_clase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hora_inicio,
                hora_final,
                id_curso,
                id_usuario,
                estado
            })
        });

   
        const data = await response.json(); 

      
        if (response.ok) {
            
            return res.status(201).json({ success: true, message: 'Clase agregada exitosamente', id_clase: data.id_clase });
        } else {
  
            return res.status(response.status).json({ success: false, message: data.message || 'Error al agregar clase en el servidor externo' });
        }

    } catch (error) {
        console.error('Error al agregar clase:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};




exports.eliminarClase = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/eliminar_clase/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            res.json({ success: true, message: 'Clase eliminada exitosamente' });
        } else {
            const errorResult = await response.json();
            console.error('Error al eliminar clase en la API:', errorResult);
            res.status(response.status).json({ success: false, error: errorResult.error || 'Error desconocido al eliminar la clase' });
        }
    } catch (error) {
        console.error('Error al eliminar la clase:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Controlador para obtener una clase específica por su ID
exports.obtenerClase = async (req, res) => {
    const { id_clase } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/obtener_clase/${id_clase}`);
        const result = await response.json();

        if (response.ok) {
            res.render('./dashboard/detalleClase', { clase: result }); // Cambia la vista según tus necesidades
        } else {
            console.error('Error al obtener clase:', result);
            res.status(404).json({ success: false, message: 'Clase no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener datos de la clase:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Obtener todos los estudiantes
exports.traerEstudiantes = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_estudiantes`);
        const data = await response.json();
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener estudiantes por clase
exports.traerEstudiantesPorClase = async (req, res, next) => {
    const claseId = req.params.claseId;
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_clases_estudiantes/${claseId}`);
        const data = await response.json();
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener estudiantes por clase:', error);
        res.status(500).send('Error interno del servidor');
    }
};


// Controlador para actualizar estudiantes en una clase desde el frontend
exports.actualizarEstudiantesPorClase = async (req, res) => {
    try {
        const response = await fetch(`${process.env.pathApi}/actualizar_estudiantes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar estudiantes en el proyecto:', error);
        res.status(500).json({ error: 'Error al actualizar estudiantes' });
    }
};
exports.traerPara = async (req, res) => {
    try {
        const response = await fetch(`${process.env.pathApi}/traer_Para`); // Cambia la URL según la API
        const data = await response.json();

        if (response.ok) {
            return res.status(200).json(data); // Enviar los datos obtenidos como respuesta JSON
        } else {
            console.error('Error al traer datos:', data);
            return res.status(response.status).json({ message: data.message || 'Error al traer los datos' });
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        return res.status(500).json({ message: 'Error interno al obtener los datos' });
    }
};