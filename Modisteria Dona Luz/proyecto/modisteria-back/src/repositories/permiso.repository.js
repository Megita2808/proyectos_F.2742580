const { Permiso, RolesPermisos } = require("../models");

exports.getAllPermisos = async () => {
    return await Permiso.findAll();
};

exports.getPermisoById = async (id) => {
    return await Permiso.findByPk(id);
}

exports.createPermiso = async (permiso) => {
    return await Permiso.create(permiso);
}

exports.updatePermiso = async (id, permiso) => {
    return await Permiso.update(permiso, { where: { id } });
}

exports.statusPermiso = async (id) => {
    return await Permiso.update({ estado: false }, { where: { id } });
}

exports.deletePermiso = async (id) => {
    const permiso = await Permiso.findByPk(id);
    
    if (!permiso) {
        throw new Error("Permiso no encontrado");
    }

    // const existeEnRolesPermisos = await RolesPermisos.findOne({ where: { permisoId: id } });
    
    // if (existeEnRolesPermisos) {
    //     throw new Error("No se puede eliminar el permiso porque está asociado a un rol");
    // }

    if (permiso.estadoId === 2) {
        return await Permiso.destroy( { where: { id } });
    }
    else {
        throw new Error("No se puede eliminar el permiso porque está activo");
    }
}
