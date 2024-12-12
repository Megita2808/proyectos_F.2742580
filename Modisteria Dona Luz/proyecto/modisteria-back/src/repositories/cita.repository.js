const { Cita, Usuario, CitaInsumo, Insumo, Venta } = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

exports.getAllCitas = async (estadoId) => {
  const whereClause = {};
  if (estadoId) {
    whereClause.estadoId = parseInt(estadoId);
  }

  return await Cita.findAll({
    where: whereClause,
    include: [
      {
        model: Usuario,
        as: "usuario",
      },
      { model: Insumo, attributes: ["nombre", "id"] },
      { model: Venta, as: "venta", attributes: ["imagen", "id"] },
    ],
  });
};

exports.getCitaById = async (id) => {
  return await Cita.findByPk(id);
};

exports.getCitasByUserId = async (usuarioId, estadoId) => {
  const whereClause = {
    usuarioId,
  };
  if (estadoId) {
    whereClause.estadoId = parseInt(estadoId);
  }
  return await Cita.findAll({
    where: whereClause,
  });
};

exports.createCita = async (cita) => {
  return await Cita.create(cita);
};

exports.updateCita = async (id, cita) => {
  return await Cita.update(cita, { where: { id } });
};

exports.statusCita = async (id, estadoId) => {
  return await Cita.update({ estadoId }, { where: { id } });
};

exports.getCitaInsumosByCitaId = async (citaId) => {
  return await CitaInsumo.findAll({ where: { cita_id: citaId } });
};

exports.returnInsumoStock = async (insumoId, cantidadC) => {
  await Insumo.update(
    { cantidad: Sequelize.literal(`cantidad + ${cantidadC}`) },
    { where: { id: insumoId } }
  );
};

exports.deleteCita = async (id) => {
  const cita = await Cita.findByPk(id);

  if (!cita) {
    throw new Error("Cita no encontrada");
  }

  // const existeUsuario = await Usuario.findOne({ where: { id: cita.usuarioId } });
  // const existeEstado = await Estado.findOne({ where: { id: cita.estadoId } });

  // if (existeUsuario || existeEstado) {
  //     throw new Error("No se puede eliminar la cita porque está asociada a registros en otras tablas");
  // }

  return await Cita.destroy({ where: { id } });
};

exports.getCitaByUAS = async (usuarioId) => {
  return await Cita.findOne({
    where: {
      usuarioId: usuarioId,
      estadoId: {
        [Op.not]: [12, 13],
      },
    },
  });
};

exports.getCitasAceptadas = async (estadoId) => {
  return await Cita.findAll({ where: { estadoId } });
};
