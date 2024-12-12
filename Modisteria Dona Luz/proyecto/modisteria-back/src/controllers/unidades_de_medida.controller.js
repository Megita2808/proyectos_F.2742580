const {
  getAllUnidadDeMedidas,
  getUnidadDeMedidaById,
  createUnidadDeMedida,
  updateUnidadDeMedida,
  deleteUnidadDeMedida
} = require("../repositories/unidades_de_medida.repository");

exports.getAllUnidadDeMedidas = async (req, res) => {
  try {
    const type = req.query.type || false;

    const unidadDeMedidas = await getAllUnidadDeMedidas(type);
    res.status(200).json(unidadDeMedidas);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getUnidadDeMedidaById = async (req, res) => {
  const { id } = req.params;
  try {
    const unidadDeMedida = await getUnidadDeMedidaById(id);
    res.status(200).json(unidadDeMedida);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createUnidadDeMedida = async (req, res) => {
  const unidadDeMedida = req.body;

  try {
    await createUnidadDeMedida(unidadDeMedida);
    res.status(201).json({ msg: "Unidad de medida creada exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateUnidadDeMedida = async (req, res) => {
  const { id } = req.params;
  const unidadDeMedida = req.body;

  try {
    await updateUnidadDeMedida(id, unidadDeMedida);
    res.status(201).json({ msg: "Unidad de medida actualizada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUnidadDeMedida = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUnidadDeMedida(id);
    res.status(201).json({ msg: "Unidad de medida eliminada" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};