const Rol = require('../../modules/usuario/rolModule');
const Permiso = require('../../modules/usuario/permisoModule');
const Usuario = require('../../modules/usuario/usuarioModule');

const rolGet = async (req, res) => {
    try {
        let roles = await Rol.find().populate({
            path: 'permisos',
            model: 'Permiso'
          });
        roles = roles.filter(rol=> rol.nombreRol !== 'Administrador')
        res.json({ roles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener roles' });
    }
};

const rolPost = async (req, res) => {
    const { nombreRol, extraPorcentaje, permisos } = req.body;

    const formattedNombreRol = nombreRol
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    try {
        const existingRol = await Rol.findOne({ nombreRol: formattedNombreRol });

        if (existingRol) {
            return res.status(400).json({ message: 'Ya existe un rol con ese nombre' });
        }

        const nuevoRol = new Rol({
            nombreRol: formattedNombreRol,
            extraPorcentaje,
            permisos
        });

        await nuevoRol.save();
        return res.status(201).json({ message: 'Rol creado con éxito', rol: nuevoRol });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el rol', error });
    }
};

const rolPut = async (req, res) => {
    const { id_rol } = req.params;
    const { nombreRol, extraPorcentaje, permisos } = req.body;

    const formattedNombreRol = nombreRol
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
    try {

        const existeRol = await Rol.findOne({ nombreRol: formattedNombreRol });

        if (existeRol && id_rol != existeRol._id) {
            return res.status(400).json({ message: 'Ya existe un rol con ese nombre' });
        }

        const rolBasico = await Rol.findById(id_rol);

        if (rolBasico.nombreRol === 'Administrador') {
            return res.status(403).json({ mensaje: `No se puede editar el rol ${rolBasico.nombreRol}.` });
        }

        await Rol.findByIdAndUpdate(
            id_rol, 
            { nombreRol : formattedNombreRol, extraPorcentaje, permisos }, 
            { new: true } 
        );
        res.status(200).json({ msg: 'Rol actualizado'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar rol' });
    }
};

const rolDelete = async (req, res) => {
    const { id_rol } = req.params;

    try {
        const rol = await Rol.findById(id_rol);

        const usarioConRol = await Usuario.findOne({rol: rol._id})

        if (usarioConRol) {
            return res.status(400).json({ message: 'No se puede eliminar un rol que tenga usuarios asociados' });
        }

        if (rol.nombreRol === 'Administrador' || rol.nombreRol === 'Distribuidor' || rol.nombreRol === 'Cliente' ) {
            return res.status(403).json({ mensaje: `No se puede eliminar el rol ${rol.nombreRol}.` });
        }

        await Rol.findByIdAndDelete(id_rol);

        if (!rol) {
            return res.status(404).json({ msg: 'Rol no encontrado' });
        }
        res.json({ msg: 'Rol eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar rol' });
    }
};

const rolActualizarEstado = async (req, res) => {
    try {
        const { id_rol } = req.params;
        const { estado } = req.body;

        if (typeof estado !== 'boolean') {
            return res.status(400).json({ mensaje: 'El estado debe ser un valor booleano.' });
        }

        const rol = await Rol.findById(id_rol);

        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado.' });
        }

        if (rol.nombreRol === 'Administrador' || rol.nombreRol === 'Cliente' || rol.nombreRol === 'Distribuidor') {
            return res.status(403).json({ mensaje: `No se puede cambiar el estado del rol ${rol.nombreRol}.` });
        }

        rol.estado = estado;
        await rol.save();

        res.status(200).json({ estado: rol.estado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado del rol.' });
    }
};

const inicializarPermisosAndRoles = async () => {
    try {
        const permisosData = [
            { nombrePermiso: 'Ventas', descripcionPermiso: 'Realizar ventas de productos a partir de un catálogo de medidas' },
            { nombrePermiso: 'Compras', descripcionPermiso: 'Realizar compras de medidas en la aplicación para crear existencias' },
            { nombrePermiso: 'Envíos', descripcionPermiso: 'Visualizar y gestionar los envíos de los clientes' },
            
            { nombrePermiso: 'Gestión de Ventas', descripcionPermiso: 'Visualizar y gestionar las ventas realizadas por los clientes' },
            { nombrePermiso: 'Gestión de Usuarios', descripcionPermiso: 'Administrar y actualizar los datos de los usuarios' },
            { nombrePermiso: 'Gestión de Distribuidores', descripcionPermiso: 'Visualizar y gestionar los diferentes estados de los distribuidores' },
            { nombrePermiso: 'Configuración', descripcionPermiso: 'Administrar los permisos para los diferente roles' },
            { nombrePermiso: 'Gestión de Catálogo', descripcionPermiso: 'Modificar el catálogo de productos según necesidades' },
            { nombrePermiso: 'Gestión de Proveedores', descripcionPermiso: 'Administrar los proveedores de medidas de producto' },
            { nombrePermiso: 'Gestión de PQRS', descripcionPermiso: 'Gestionar y resolver peticiones, quejas, reclamos y sugerencias' },
        
            { nombrePermiso: 'Informes', descripcionPermiso: 'Acceder y generar reportes de ventas y rendimiento' },
            { nombrePermiso: 'Inventario', descripcionPermiso: 'Administrar y actualizar el inventario de productos' },

            { nombrePermiso: 'Dashboard', descripcionPermiso: 'Visualziar Dashboard' },
            { nombrePermiso: 'Dashboard Estadisticas', descripcionPermiso: 'Visualizar estadisticas de la empresa' },

            { nombrePermiso: 'Calendario', descripcionPermiso: 'Visualizar las ventas y envios' },
        ];        

        const permisos = await Promise.all(
            permisosData.map(async (permisoData) => {
                let permiso = await Permiso.findOne({ nombrePermiso: permisoData.nombrePermiso });
                if (!permiso) {
                    permiso = new Permiso(permisoData);
                    await permiso.save();
                }
                return permiso;
            })
        );

        const permisosIds = permisos.map(p => p._id);

        let rolAdmin = await Rol.findOne({ nombreRol: 'Administrador' });
        if (!rolAdmin) {
            const nuevoRolAdmin = new Rol({
                nombreRol: 'Administrador',
                permisos: permisosIds,
                extraPorcentaje: 0,
            });
            rolAdmin = await nuevoRolAdmin.save();
        }

        const permisoVentas = permisos.find(p => p.nombrePermiso === 'Ventas');
        
        const rolCliente = await Rol.findOne({ nombreRol: 'Cliente' });
        if (!rolCliente) {
            const nuevoRolCliente = new Rol({
                nombreRol: 'Cliente',
                permisos: [permisoVentas?._id],
                extraPorcentaje: 0.2,
            });
            await nuevoRolCliente.save();
        }

        const rolDistribuidor = await Rol.findOne({ nombreRol: 'Distribuidor' });
        if (!rolDistribuidor) {
            const nuevoRolDistribuidor = new Rol({
                nombreRol: 'Distribuidor',
                permisos: [],
                extraPorcentaje: 0,
            });
            await nuevoRolDistribuidor.save();
        }

        const usuarioAdmin = await Usuario.findOne({ correo: 'zsantiagohenao@gmail.com' });
        if (!usuarioAdmin) {
            const nuevoUsuarioAdmin = new Usuario({
                nombre: 'Admin',
                password: '1234567890',
                correo: 'zsantiagohenao@gmail.com',
                telefono: '3243118618',
                rol: rolAdmin ? rolAdmin._id : null
            });
            await nuevoUsuarioAdmin.save();
        }
    } catch (error) {
        console.error('Error al inicializar roles y permisos:', error);
    }
};

module.exports = {
    rolGet,
    rolPost,
    rolPut,
    rolDelete,
    rolActualizarEstado,
    inicializarPermisosAndRoles
};
