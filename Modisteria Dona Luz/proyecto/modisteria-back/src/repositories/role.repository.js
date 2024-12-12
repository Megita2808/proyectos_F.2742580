const { Role, RolesPermisos, Permiso, Estado, Usuario } = require("../models");

exports.getAllRoles = async () => {
  return await Role.findAll({
    include: [
      { model: Permiso, attributes: ["id", "nombre"] },
      { model: Usuario, as: "usuarios", attributes: ["id", "nombre"] },
    ],
  });
};

exports.getRoleById = async (id) => {
  return await Role.findOne({
    where: { id },
    // include: [ { model: RolesPermisos, as: "roles_permisos"} ],
    //raw: true Devuelve el objeto literal desde la bd
  });
};

exports.createRole = async (role) => {
  return await Role.create(role);
};

exports.updateRole = async (id, nombre, permisosId, estadoId) => {
  return await Role.update({ nombre, permisosId, estadoId }, { where: { id } });
};

exports.statusRole = async (id) => {
  return await Role.update({ estado: false }, { where: { id } });
};

exports.deleteRole = async (id) => {
  const role = await Role.findOne({
    where: { id },
  });

  if (!role) {
    throw new Error("Rol no encontrado");
  }

  const existeUsuario = await Usuario.findOne({ where: { roleId: role.id } });

  if (existeUsuario) {
    throw new Error(
      "No se puede eliminar el rol porque está asociado a registros en otras tablas"
    );
  }

  return await Role.destroy({ where: { id } });
};
