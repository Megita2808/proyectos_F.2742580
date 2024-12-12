const constantsRoles = require("../constants/role.constants");
const constantsPermisos = require("../constants/permiso.constants");
const { getRoleById } = require("../repositories/role.repository");
const { getUserByEmail } = require("../repositories/usuario.repository");
const { sequelize } = require("../database/connection");

exports.validateRoleAdmin = (req, res, next) => {
  if (req.roleId !== constantsRoles.ROL_ADMIN)
    return res.status(403).json({ msg: "No tiene los permisos suficientes" });
  next();
};

exports.validateRoleAdminAndDomiciliario = (req, res, next) => {
  if (
    !(
      req.roleId == constantsRoles.ROL_ADMIN ||
      req.roleId == constantsRoles.ROL_DOMICILIARIO
    )
  )
    return res.status(403).json({ msg: "No tiene los permisos suficientes" });
  next();
};

exports.buscarPermiso = (permiso) => {
  return async (req, res, next) => {
    const roleId = req.roleId;

    if (!roleId) {
      return res.status(403).json({ message: "Rol no encontrado" });
    }

    try {
      // Usar Sequelize para hacer la consulta
      const results = await sequelize.query(
        `
                SELECT p.nombre
                FROM "Permisos" p
                JOIN "roles_permisos" rp ON p.id = rp."PermisoId"
                JOIN "Roles" r ON rp."RoleId" = r.id
                WHERE r.id = ?
            `,
        {
          replacements: [roleId],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const permisos = Array.isArray(results)
        ? results.map((result) => result.nombre)
        : [results.nombre];
      // console.log("Permisos:", permisos);

      if (!permisos.includes(permiso)) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para acceder a esta ruta." });
      }

      next();
    } catch (err) {
      console.error("Error al obtener los permisos del rol:", err);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  };
};

exports.emailExist = async (req, res, next) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (user) return res.status(400).json({ msg: "El correo ya existe" });
  next();
};
