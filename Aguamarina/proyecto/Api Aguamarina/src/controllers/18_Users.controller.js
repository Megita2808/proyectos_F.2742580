import Users from '../models/18_User.model.js';
import Roles from '../models/1_Rol.model.js';
import bcrypt from "bcrypt"
import Permission from '../models/2_Permission.model.js';
import RolPermissions from '../models/3_RolPermissions.model.js';

export const getUsers = async(req, res) => {
    const allUsers = await Users.findAll();
    const users = await Promise.all(allUsers.map(async(user) => {
        const rol = await Roles.findByPk(user.id_rol)
        user.setDataValue('rol', rol.name);
        return user;
    }))
    try {
        res.status(200).json({
            ok : true,
            status : 200,
            body : users
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getUserById = async(req, res) => {
    const {id} = req.params;
    try {
        const users = await Users.findByPk(id);
        const rol = await Roles.findByPk(users.id_rol);
        const idsPermissions = await RolPermissions.findAll({where: {id_rol : users.id_rol}});
        let accessDashboard = false;
        const permissions = await Promise.all(idsPermissions.map(async (per) => {
            if(per.id_permission == 1) {
                accessDashboard = true;
            }
            return await Permission.findByPk(per.id_permission);
        }));
        users.setDataValue('rol', rol);
        users.setDataValue('permissions', permissions);
        users.setDataValue('accessDashboard', accessDashboard);
        res.status(200).json({
            ok : true,
            status : 200,
            body : users
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getUserByMail = async(req, res) => {
    const {mail} = req.body;
    try {
        const users = await Users.findAll({where : {mail}});
        const rol = await Roles.findByPk(users.id_rol)
        users.setDataValue('rol', rol);
        res.status(200).json({
            ok : true,
            status : 200,
            body : users
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createUser = async(req, res) => {
    const {names, lastnames, dni, mail, password, phone_number, id_rol = 2, status = true} = req.body;
    try {
        const users = await Users.findAll({where : {mail}})
        if (users.length > 0) {
            return res.status(200).json({
                ok : false,
                status : 200,
                message : "Ya se encuentra registrado el correo electrónico",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordBcrypt = await bcrypt.hash(password.toString(), salt);
        const createdUser = await Users.create({names, lastnames, dni, mail, password : passwordBcrypt, phone_number, id_rol, status});
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Usuario Registrado Correctamente",
            body : createdUser
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const updateUserById = async(req, res) => {
    const {id} = req.params;
    const {names, lastnames, dni, mail, password, phone_number, id_rol, status} = req.body;
    try {
        const [updatedUser] = await Users.update({names, lastnames, dni, mail, password, phone_number, id_rol, status}, {where : {id_user : id}});
        let isUpdated;
        updatedUser <= 0 ? (isUpdated = false) : (isUpdated = true);
        res.status(200).json({
            ok : true,
            status : 200,
            message : "Updated User",
            body : {
                affectedRows : updatedUser,
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

export const changeStatusById = async(req, res) => {
    const {id} = req.params;
    try {
        const user = await Users.findByPk(id);
        if (user.id == 1) {
            return res.status(201).json({
                ok : false,
                status : 201,
                body : {
                    patchedUser : 0,
                    isPatched : false
                }
            })
        }
        const newStatus = user.status == 1 ? 0 : 1;
        const patchedUser = await Users.update({status : newStatus}, {where : {id_user : id}});
        let isPatched;
        patchedUser <= 0 ? (isPatched = false) : (isPatched = true);
        console.log(newStatus)
        res.status(201).json({
            ok : true,
            status : 201,
            body : {
                patchedUser,
                isPatched
            }
        });
    }  catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const deleteUserById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedUser = await Users.destroy({where : {id_user : id}});
        let isDeleted;
        deletedUser <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedUser,
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

// De aquí en adelante estarán todas las rutas de autenticación, Verificación y Validación de Usuarios y Más
