const Permiso = require('../../modules/usuario/permisoModule');

const permisoGet = async (req, res) => {
    try {
        const permisos = await Permiso.find();
        res.json({ permisos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener permisos' });
    }
};

const permisoPost = async (req, res) => {
    const { nombrePermiso, descripcionPermiso } = req.body;

    const nuevoPermiso = new Permiso({
        nombrePermiso,
        descripcionPermiso
    });

    try {
        await nuevoPermiso.save();
        res.json({ msg: 'Permiso creado correctamente', permiso: nuevoPermiso });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear permiso' });
    }
};

const permisoPut = async (req, res) => {
    const { id_permiso } = req.params;
    const { nombrePermiso, descripcionPermiso, estado } = req.body;

    try {
        const permiso = await Permiso.findByIdAndUpdate(
            id_permiso, 
            { nombrePermiso, descripcionPermiso, estado }, 
            { new: true }
        );
        res.json({ msg: 'Permiso actualizado', permiso });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar permiso' });
    }
};

const permisoDelete = async (req, res) => {
    const { id_permiso } = req.params;

    try {
        const permiso = await Permiso.findByIdAndDelete(id_permiso);
        if (!permiso) {
            return res.status(404).json({ msg: 'Permiso no encontrado' });
        }
        res.json({ msg: 'Permiso eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar permiso' });
    }
};

const permisoActualizarEstado = async (req, res) => {
    try {
      const { id_permiso } = req.params;
      const { estado } = req.body;
      
      if (typeof estado !== 'boolean') {
        return res.status(400).json({ mensaje: 'El estado debe ser un valor booleano.' });
      }
  
      const permiso = await Permiso.findByIdAndUpdate(
        id_permiso,
        { estado },
        { new: true }
      );
  
      if (!permiso) {
        return res.status(404).json({ mensaje: 'Permiso no encontrada.' });
      }
  
      res.json({ estado: permiso.estado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar el estado del permiso.'});
    }
};

module.exports = {
    permisoGet,
    permisoPost,
    permisoPut,
    permisoDelete,
    permisoActualizarEstado
};
