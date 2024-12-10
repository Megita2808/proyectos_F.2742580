const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Función para obtener todos los cursos
exports.obtenerCursoss = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_cursoss`);
        const cursoss = await response.json();

        if (response.ok) {
            res.locals.cursoss = cursoss; // Pasamos los cursos a res.locals
            return next(); // Aseguramos que el middleware continúe
        } else {
            console.error('Error al traer cursos:', cursoss);
            res.status(response.status).send(cursoss.message || 'Error al obtener cursos');
        }
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error al obtener cursos');
    }
};


// Función para traer eventos por nombre de curso
exports.traerEventosPorNombreCurso = async (req, res) => {
    const { nombre_curso } = req.params;
    try {
        const response = await fetch(`${process.env.pathApi}/traerEventosPorNombreClase/${nombre_curso}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(500).json({ error: 'Error al obtener los eventos del curso' });
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Función para traer todos los eventos
exports.traerEventos = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/traer_eventos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(500).json({ error: 'Error al obtener todos los eventos' });
        }

        const data = await response.json();
        res.locals.eventos = data;  // Asignamos los eventos a res.locals
        
        next();  // Continuamos con el siguiente middleware o controlador
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Función para obtener un evento por ID
exports.obtenerEventoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_evento/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(500).json({ error: 'Error al obtener el evento' });
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Función para agregar un nuevo evento
exports.agregarEvento = async (req, res) => {
    const { 
        nombre_evento, 
        descripcion, 
        tipo_evento, 
        ubicacion, 
        fecha_hora_inicio, 
        fecha_hora_final, 
        id_curso, 
        color_evento, 
        duracion, 
        notificar, 
        descripcion_notificacion, 
        estado 
    } = req.body;

    try {
        const response = await fetch(`${process.env.pathApi}/agregar_evento`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_evento,
                descripcion,
                tipo_evento,
                ubicacion,
                fecha_hora_inicio,
                fecha_hora_final,
                id_curso,
                color_evento,
                duracion,
                notificar,
                descripcion_notificacion,
                estado
            })
        });

        if (!response.ok) {
            return res.status(500).json({ error: 'Error al agregar el evento' });
        }

        const data = await response.json();
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Función para actualizar un evento
exports.actualizarEvento = async (req, res) => {
    const { id } = req.params;
    const { 
        nombre_evento, 
        descripcion, 
        tipo_evento, 
        ubicacion, 
        fecha_hora_inicio, 
        fecha_hora_final, 
        id_curso, 
        color_evento, 
        duracion, 
        notificar, 
        descripcion_notificacion, 
        estado 
    } = req.body;

    try {
        const response = await fetch(`${process.env.pathApi}/actualizar_evento/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_evento,
                descripcion,
                tipo_evento,
                ubicacion,
                fecha_hora_inicio,
                fecha_hora_final,
                id_curso,
                color_evento,
                duracion,
                notificar,
                descripcion_notificacion,
                estado
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error en la actualización:', errorData);
            return res.status(500).json({ error: 'Error al actualizar el evento', details: errorData });
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Error al actualizar el evento:', error);
        return res.status(500).json({ error: error.message });
    }
};


// Función para eliminar un evento
exports.eliminarEvento = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`${process.env.pathApi}/eliminar_evento/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(500).json({ error: 'Error al eliminar el evento' });
        }

        return res.status(204).send(); // No content
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.cargarEventoParaActualizar = async (req, res) => {
    const { id } = req.params; // ID del evento a actualizar

    try {
        // Obtener el evento por ID
        const eventoResponse = await fetch(`${process.env.pathApi}/obtener_evento/${id}`);
        const evento = await eventoResponse.json();

        // Obtener todos los cursos
        const cursosResponse = await fetch(`${process.env.pathApi}/obtener_cursos`);
        const cursoss = await cursosResponse.json();

        // Verificar si las respuestas son exitosas
        if (!eventoResponse.ok || !cursosResponse.ok) {
            return res.status(500).json({ error: 'Error al obtener los datos' });
        }

        // Renderizar el modal con el evento y los cursos
        res.render('admin/modalUpdateEvento', { evento, cursoss }); // Asegúrate de que la vista sea la correcta
    } catch (error) {
        console.error('Error al cargar datos para actualizar:', error);
        return res.status(500).json({ error: error.message });
    }
};

