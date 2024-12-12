const {
  getAllEstados,
  getEstadoById,
  createEstado,
  updateEstado,
  deleteEstado,
} = require("../repositories/estado.repository");

exports.getAllEstados = async (req, res) => {
  try {
    const estados = await getAllEstados();
    res.status(200).json(estados);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getEstadoById = async (req, res) => {
  const { id } = req.params;

  try {
    const estado = await getEstadoById(id);
    res.status(200).json(estado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createEstado = async (req, res) => {
  const estado = req.body;

  try {
    await createEstado(estado);
    res.status(201).json({ msg: "Estado creado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateEstado = async (req, res) => {
  const { id } = req.params;
  const estado = req.body;
  try {
    await updateEstado(id, estado);
    res.status(201).json({ msg: "Estado actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.statusEstado = async (req, res) => {
  const { id } = req.params;

  try {
    await statusEstado(id);
    res.status(201).json({ msg: "Estado inactivo" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteEstado = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteEstado(id);
    res.status(201).json({ msg: "Estado eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
