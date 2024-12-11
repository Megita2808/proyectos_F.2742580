import Permissions from "../models/2_Permission.model.js";

export const getPermissions = async(req, res) => {
    const permissions = await Permissions.findAll();
    try {
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

export const getPermissionById = async(req, res) => {
    const {id} = req.params;
    try {
        const permissions = await Permissions.findByPk(id);
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

export const createPermission = async(req, res) => {
    const {name, description, area} = req.body;
    try {
        const createdPermission = await Permissions.create({name, description, area});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created Permission",
            body : createdPermission
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const updatePermissionById = async(req, res) => {
    const {id} = req.params;
    const {name, description, area} = req.body;
    try {
        const [updatedPermission] = await Permissions.update({name, description, area}, {where : {id_permission : id}});
        let isUpdated;
        updatedPermission <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated Permission",
            body : {
                affectedRows : updatedPermission,
                isUpdated
            }
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const deletePermissionById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedPermission = await Permissions.destroy({where : {id_permission : id}});
        let isDeleted;
        deletedPermission <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedPermission,
                isDeleted
            }
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    }
};