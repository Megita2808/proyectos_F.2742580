const { Insumo, InsumoHistorial } = require("../models");
const { Sequelize } = require("sequelize");
const { getInsumoHistorialByInsumoId, getInsumoHistorial } = require("../repositories/insumo_historial.repository");

exports.getInsumoHistorial = async (req, res) => {
  try {
    const insumoHistorial = await getInsumoHistorial();
    res.status(200).json(insumoHistorial);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getInsumoHistorialByInsumoId = async (req, res) => {
    const { insumo_id } = req.params;

  try {
    const insumo = await getInsumoHistorialByInsumoId(insumo_id);
    res.status(200).json(insumo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  };