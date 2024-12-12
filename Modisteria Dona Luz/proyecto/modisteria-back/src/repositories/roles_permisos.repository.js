const { RolesPermisos } = require("../models");

exports.createRolesPermiso = async (roleId, permisosId) => {
    permisosId.map(async permisoId => {
        await RolesPermisos.create({roleId, permisoId});
    });
}

exports.deleteRolesPermiso = async (id) => {
    return await RolesPermisos.destroy( { where: { roleId: id } });
}

