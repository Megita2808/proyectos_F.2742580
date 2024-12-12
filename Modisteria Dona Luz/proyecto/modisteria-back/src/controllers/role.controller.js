const { Permiso, Role } = require("../models");
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require("../repositories/role.repository");
const {
  createRolesPermiso,
  deleteRolesPermiso,
} = require("../repositories/roles_permisos.repository");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getRoleById = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await getRoleById(id);
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createRole = async (req, res) => {
  const { nombre, permisosId, estadoId } = req.body;

  try {
    const newRole = {
      nombre,
      estadoId,
    };
    const rolCreado = await createRole(newRole);
    const permisosInstancias = await Permiso.findAll({
      where: { id: permisosId },
    });
    await rolCreado.addPermisos(permisosInstancias);
    res.status(201).json({ msg: "Rol creado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, permisosId, estadoId } = req.body;

    const existingRole = await Role.findByPk(id);
    if (!existingRole) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    const updatedRole = {
      nombre: nombre || existingRole.nombre,
      estadoId: estadoId || existingRole.estadoId,
    };

    if (permisosId && permisosId.length > 0) {
      await existingRole.setPermisos([]);

      const permisosInstancias = await Permiso.findAll({
        where: { id: permisosId },
      });

      await existingRole.addPermisos(permisosInstancias);
    }

    await existingRole.update(updatedRole);
    res.status(200).json({ msg: "Rol actualizado exitosamente" });
  } catch (error) {
    console.error(`Error en updateRole: ${error.message}`);
    res.status(500).json({ error: "Error al actualizar el rol" });
  }
};

exports.statusRole = async (req, res) => {
  const { id } = req.params;

  try {
    await statusRole(id);
    res.status(201).json({ msg: "Rol inactivo" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteRole(id);
    res.status(201).json({ msg: "Rol eliminado" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
