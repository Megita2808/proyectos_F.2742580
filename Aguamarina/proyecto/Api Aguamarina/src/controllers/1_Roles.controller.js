import Roles from "../models/1_Rol.model.js";
import Permission from "../models/2_Permission.model.js";
import RolPermissions from "../models/3_RolPermissions.model.js";
import sequelize from '../db/sequelize.js';

export const getRoles = async(req, res) => {
    try {
        const roles = await Roles.findAll();

        await Promise.all(roles.map(async (rol) => {
            const idsPermissions = await RolPermissions.findAll({where: {id_rol : rol.id_rol}});
            const permissions = await Promise.all(idsPermissions.map(async (per) => {
                return await Permission.findByPk(per.id_permission);
            }))
            rol.setDataValue('permissions', permissions);
        }))

        res.status(200).json({
            ok : true,
            status : 200,
            body : roles
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const getRolById = async(req, res) => {
    const {id} = req.params;
    try {
        const rol = await Roles.findByPk(id);

        const idsPermissions = await RolPermissions.findAll({where: {id_rol : rol.id_rol}});
        const permissions = await Promise.all(idsPermissions.map(async (per) => {
            return await Permission.findByPk(per.id_permission);
        }))
        rol.setDataValue('permissions', permissions);

        res.status(200).json({
            ok : true,
            status : 200,
            body : rol
        });
    } catch(err) {
        res.status(400).json({
            ok : false,
            status : 400,
            err
        });
    };
};

export const createRol = async(req, res) => {
    const {name, description, permissions} = req.body;
    try {
        const createdRol = await Roles.create({name, description});
        permissions.map(async(per) => await RolPermissions.create({id_rol : createdRol.id_rol, id_permission : per}));
        res.status(201).json({
            ok : true,
            status : 201,
            message : "Created Rol",
            body : createdRol
        });
    } catch(err) {
        res.status(200).json({
            ok : false,
            status : 400,
            err,
            permissions
        });
    };
};

export const updateRolById = async (req, res) => {
    const { id } = req.params;
    const { name, description, permissions } = req.body;
  
    const transaction = await sequelize.transaction(); // Inicia una transacción
  
    try {
      // Actualizar detalles del rol
      const [updatedRol] = await Roles.update(
        { name, description },
        { where: { id_rol: id }, transaction }
      );
  
      if (updatedRol <= 0) {
        throw new Error("Rol no encontrado o no actualizado");
      }
  
      // Obtener permisos actuales del rol
      const currentPermissions = await RolPermissions.findAll({
        where: { id_rol: id },
        attributes: ["id_permission"],
        transaction,
      });
  
      const currentPermissionIds = currentPermissions.map((perm) => perm.id_permission);
  
      // Identificar permisos a agregar y a eliminar
      const permissionsToAdd = permissions.filter((perm) => !currentPermissionIds.includes(perm));
      const permissionsToRemove = currentPermissionIds.filter((perm) => !permissions.includes(perm));
  
      // Agregar nuevos permisos
      await Promise.all(
        permissionsToAdd.map((perm) =>
          RolPermissions.create({ id_rol: id, id_permission: perm }, { transaction })
        )
      );
  
      // Eliminar permisos no deseados
      await RolPermissions.destroy({
        where: { id_rol: id, id_permission: permissionsToRemove },
        transaction,
      });
  
      // Confirmar transacción
      await transaction.commit();
  
      res.status(200).json({
        ok: true,
        status: 200,
        message: "Updated Rol and Permissions",
        body: {
          updatedRol,
          addedPermissions: permissionsToAdd,
          removedPermissions: permissionsToRemove,
        },
      });
    } catch (err) {
      // Revertir cambios en caso de error
      await transaction.rollback();
  
      res.status(400).json({
        ok: false,
        status: 400,
        message: "Error updating Rol",
        error: err.message,
      });
    }
  };

export const deleteRolById = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedRol = await Roles.destroy({where : {id_rol : id}});
        let isDeleted;
        deletedRol <= 0 ? (isDeleted = false) : (isDeleted = true);
        res.status(201).json({
            ok : true,
            status : 204,
            body : {
                deletedRol,
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