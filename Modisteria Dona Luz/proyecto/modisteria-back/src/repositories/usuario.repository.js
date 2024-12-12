const { Usuario, Role, Domicilio, Pedido, Permiso } = require("../models");
const { Op } = require("sequelize");

//Consultas básicas
exports.getAllUsers = async () => {
  return await Usuario.findAll({ include: [{ model: Role, as: "role" }] });
};

exports.getAllDomiciliarios = async (rolDomiciliario) => {
  return await Usuario.findAll({ where: { roleId: rolDomiciliario } });
};

exports.getUserById = async (id) => {
  return await Usuario.findByPk(id, {
    include: [
      {
        model: Role,
        as: "role",
        include: { model: Permiso, attributes: ["id"] },
      },
    ],
  });
};

exports.createUser = async (user) => {
  return await Usuario.create(user);
};

exports.getEmailByUserId = async (usuarioId) => {
  const usuario = await Usuario.findOne({ where: { id: usuarioId } });
  return usuario ? usuario.email : null; // Devuelve null si no se encuentra el usuario
};

exports.updateUser = async (id, user) => {
  return await Usuario.update(user, { where: { id } });
};

exports.statusUser = async (id) => {
  return await Usuario.update({ estado: false }, { where: { id } });
};

exports.deleteUser = async (id) => {
  const user = await Usuario.findByPk(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const existeDomicilio = await Domicilio.findOne({
    where: { usuarioId: user.id },
  });
  const existePedido = await Pedido.findOne({ where: { usuarioId: user.id } });

  if (existeDomicilio || existePedido) {
    throw new Error(
      "No se puede eliminar el usuario porque está asociado a registros en otras tablas"
    );
  }

  return await Usuario.destroy({ where: { id } });
};

exports.getUserByEmail = async (email) => {
  return await Usuario.findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: "role",
        include: { model: Permiso, attributes: ["id"] },
      },
    ],
  });
};
exports.getCodeByEmail = async (email) => {
  try {
    const user = await Usuario.findOne({
      where: { email: email },
      attributes: ["codigo"],
    });
    return user ? user.codigo : null;
  } catch (error) {
    throw error;
  }
};
exports.getRole = async (roleId) => {
  try {
    const role = await Role.findOne({
      where: { id: roleId },
      attributes: ["nombre"],
    });
    if (!role) {
      throw new Error("Rol no encontrado");
    }
    return role.nombre;
  } catch (error) {
    throw error;
  }
};

//Consultas de recuperación de contraseña
exports.verifyCode = async (email, code) => {
  return await Usuario.findOne({
    where: { email, codigo: code, exp_cod: { [Op.gt]: new Date() } },
  });
};

exports.SaveCode = async (email, codigo, exp_cod) => {
  return await Usuario.update({ codigo, exp_cod }, { where: { email } });
};

exports.updateAndClear = async (email, encriptada) => {
  try {
    await Usuario.update(
      {
        password: encriptada,
        codigo: null,
        exp_cod: null,
      },
      {
        where: { email },
      }
    );
    return { success: true };
  } catch (error) {
    console.error(
      "Error al actualizar la contraseña y limpiar el código de restablecimiento:",
      error
    );
    return { success: false, error };
  }
};
