const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
  host: '34.83.112.237',
  user: 'root',
  password:`j'&&,|An}Fg"qMRM`,
  database: 'yamix',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

exports.obtenerCursoss = async (req, res) => {
    const query = 'SELECT id_curso, nombre_curso FROM cursos WHERE estado = "activo"';
    try {
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
const moment = require('moment');

exports.traerEventos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id_evento, 
        e.nombre_evento, 
        e.descripcion, 
        e.ubicacion, 
        e.fecha_hora_inicio, 
        e.fecha_hora_final, 
        e.id_curso, 
        e.color_evento, 
       
        e.estado, 
        c.nombre_curso
      FROM eventos e
      JOIN cursos c ON e.id_curso = c.id_curso
    `);

    const eventos = rows.map(evento => ({
      ...evento,
      fecha_hora_inicio: moment(evento.fecha_hora_inicio).format('YYYY-MM-DDTHH:mm'),
      fecha_hora_final: moment(evento.fecha_hora_final).format('YYYY-MM-DDTHH:mm'),
    }));

    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};


exports.traerEventosU = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id_evento, 
        e.nombre_evento, 
        e.descripcion, 
        e.ubicacion, 
        e.fecha_hora_inicio, 
        e.fecha_hora_final, 
        e.id_curso, 
        e.color_evento, 
    
        e.estado, 
        c.nombre_curso, 
        c.link
      FROM eventos e
      JOIN cursos c ON e.id_curso = c.id_curso
      WHERE e.estado = 'activo'
    `);

    const eventos = rows.map(evento => ({
      ...evento,
      fecha_hora_inicio: moment(evento.fecha_hora_inicio).format('YYYY-MM-DDTHH:mm'),
      fecha_hora_final: moment(evento.fecha_hora_final).format('YYYY-MM-DDTHH:mm'),
    }));

    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};


exports.traerEventosPorNombreCurso = async (req, res) => {
  const { nombre_curso } = req.params; // Obtener el nombre_curso del parámetro de la ruta
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.nombre_curso
      FROM eventos e
      JOIN cursos c ON e.id_curso = c.id_curso
      WHERE c.nombre_curso = ?
    `, [nombre_curso]); // Filtrar por el nombre_curso proporcionado
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos del curso' });
  }
};

exports.obtenerEvento = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(`
      SELECT eventos.*, cursos.nombre_curso 
      FROM eventos 
      LEFT JOIN cursos ON eventos.id_curso = cursos.id_curso 
      WHERE eventos.id_evento = ?`, [id]);
      
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Evento no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el evento' });
  }
};

// Otros imports y configuraciones...
exports.agregarEvento = async (req, res) => {
  const { 
      nombre_evento, descripcion,  ubicacion, fecha_inicio, fecha_fin, 
      color_evento, id_curso
  } = req.body;



  // Estado por defecto
  const estado = 'activo'; // Cambia esto según tu lógica si es necesario


  // Crear las fechas con formato correcto
  const fecha_hora_inicio = `${fecha_inicio}`;
  const fecha_hora_final = `${fecha_fin}`;

 

  try {
      // Verificar si el curso ya tiene un evento solapado con las fechas proporcionadas
      const checkSolapamientoQuery = `
          SELECT COUNT(*) AS count 
          FROM eventos 
          WHERE id_curso = ? 
          AND (
              (fecha_hora_inicio < ? AND fecha_hora_final > ?) OR
              (fecha_hora_inicio BETWEEN ? AND ?) OR
              (fecha_hora_final BETWEEN ? AND ?) OR
              (fecha_hora_inicio <= ? AND fecha_hora_final >= ?)
          )
      `;

 

      const [solapamientoResult] = await pool.query(checkSolapamientoQuery, [
          id_curso, 
          fecha_hora_inicio, fecha_hora_inicio, 
          fecha_hora_final, fecha_hora_final,
          fecha_hora_inicio, fecha_hora_final,
          fecha_hora_inicio, fecha_hora_final
      ]);

    

      // Asegurarse de que count sea un número
      if (Number(solapamientoResult[0].count) > 0) {

          return res.status(400).json({ message: 'El curso ya tiene un evento programado en este rango de fechas.' });
      }

      



      const [result] = await pool.query(`
          INSERT INTO eventos 
            (nombre_evento, descripcion,  ubicacion, fecha_hora_inicio, fecha_hora_final, color_evento, id_curso, estado) 
          VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?)`,
          [nombre_evento, descripcion,  ubicacion, fecha_hora_inicio, fecha_hora_final, color_evento, id_curso,  estado]
      );

    

      res.status(201).json({ message: 'Evento agregado exitosamente', id_evento: result.insertId });
  } catch (error) {
      console.error('Error al agregar evento:', error);
      res.status(500).json({ message: 'Error al agregar evento', error });
  }
};


  
exports.actualizarEvento = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre_evento, descripcion,  ubicacion, fecha_hora_inicio, fecha_hora_final, 
    color_evento, id_curso,  estado 
  } = req.body;

  try {
    // Validaciones de fecha
    if (fecha_hora_inicio && fecha_hora_final) {
      const inicio = new Date(fecha_hora_inicio);
      const final = new Date(fecha_hora_final);

      if (inicio < new Date()) {
        return res.status(400).json({ success: false, message: 'La fecha de inicio no puede ser anterior a la fecha actual.' });
      }

      if (final < inicio) {
        return res.status(400).json({ success: false, message: 'La fecha de finalización no puede ser anterior a la fecha de inicio.' });
      }

      // Verificar si el curso tiene eventos solapados con las fechas proporcionadas
      const checkSolapamientoQuery = `
        SELECT COUNT(*) AS count 
        FROM eventos 
        WHERE id_curso = ? 
        AND id_evento != ? 
        AND (
            (fecha_hora_inicio < ? AND fecha_hora_final > ?) OR
            (fecha_hora_inicio BETWEEN ? AND ?) OR
            (fecha_hora_final BETWEEN ? AND ?) OR
            (fecha_hora_inicio <= ? AND fecha_hora_final >= ?)
        )
      `;

      const [solapamientoResult] = await pool.query(checkSolapamientoQuery, [
        id_curso, id, 
        fecha_hora_inicio, fecha_hora_inicio, 
        fecha_hora_final, fecha_hora_final,
        fecha_hora_inicio, fecha_hora_final,
        fecha_hora_inicio, fecha_hora_final
      ]);

      // Si se encuentra solapamiento, devolver un error
      if (Number(solapamientoResult[0].count) > 0) {
        return res.status(400).json({ success: false, message: 'El curso ya tiene un evento programado en este rango de fechas.' });
      }
    }

    // Proceder con la actualización del evento
    const updates = [];
    const values = [];

    // Verificar si cada campo está presente y agregarlo a la consulta
    if (nombre_evento) {
      updates.push('nombre_evento = ?');
      values.push(nombre_evento);
    }
    if (descripcion) {
      updates.push('descripcion = ?');
      values.push(descripcion);
    }
    if (ubicacion) {
      updates.push('ubicacion = ?');
      values.push(ubicacion);
    }
    if (fecha_hora_inicio) {
      updates.push('fecha_hora_inicio = ?');
      values.push(fecha_hora_inicio);
    }
    if (fecha_hora_final) {
      updates.push('fecha_hora_final = ?');
      values.push(fecha_hora_final);
    }
    if (color_evento) {
      updates.push('color_evento = ?');
      values.push(color_evento);
    }
    if (id_curso) {
      updates.push('id_curso = ?');
      values.push(id_curso);
    }
 
    if (estado) {
      updates.push('estado = ?');
      values.push(estado);
    }

  

    // Verificar si se proporcionaron campos para actualizar
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No se proporcionaron datos para actualizar' });
    }

    values.push(id); 

    // Construir la consulta SQL para actualizar el evento
    const sql = `UPDATE eventos SET ${updates.join(', ')} WHERE id_evento = ?`;
    const [result] = await pool.query(sql, values);

    // Verificar si la actualización fue exitosa
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado o no actualizado' });
    }

    return res.json({ success: true, message: 'Evento actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el evento:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar el evento' });
  }
};


  exports.eliminarEvento = async (req, res) => {
    const id = req.params.id;
    try {
      await pool.query('DELETE FROM eventos WHERE id_evento = ?', [id]);
      res.json({ success: true, message: 'Evento eliminado' });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar el evento',
        details: error.message
      });
    }
  };
  
// Evento controlador para cargar evento
exports.cargarEventoParaActualizar = async (req, res) => {
  try {
    const { id } = req.params;
    // Aquí deberías obtener el evento desde la base de datos
    const [evento] = await pool.query('SELECT * FROM eventos WHERE id_evento = ?', [id]);

    if (evento.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Aquí obtienes todos los cursos disponibles
    const [cursos] = await pool.query('SELECT * FROM cursos');

    // Pasas el evento y los cursos a la vista
    res.render('admin/modalUpdateEvento', { 
      evento: evento[0],  // El evento que se está editando
      cursos: cursos      // Lista de cursos disponibles
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cargar el evento' });
  }
};
