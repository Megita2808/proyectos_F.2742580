import Permissions from "../models/2_Permission.model.js";

import RolPermissions from "../models/3_RolPermissions.model.js"

export const getPermissionsByRol = async(req, res) => {
    const {id} = req.params
    try {
        const permissions = await RolPermissions.findAll({where : {id_rol : id}});
        res.status(200).json({
            ok : true,
            status : 200,
            body : permissions
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getNamesPermissionsByRolFunc = async (id) => {
    try {
        const rolPermissions = await RolPermissions.findAll({
            where: { id_rol : id },
            attributes: ['id_permission']
        });

        if (rolPermissions.length === 0) {
            return null
        }

        const permissionIds = rolPermissions.map(rp => rp.id_permission);

        const permissions = await Permissions.findAll({
            where: { id_permission: permissionIds },
            attributes: ['name']
        });

        const permissionNames = permissions.map(permission => permission.name);
 
        return permissionNames;

    } catch (err) {
        return null;
    }
};

