const {
  getAllTallas,
  getTallaById,
  createTalla,
  updateTalla,
  deleteTalla,
} = require("../repositories/talla.repository");

exports.getAllTallas = async (req, res) => {
  try {
    const tallas = await getAllTallas();
    res.status(200).json(tallas);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getTallaById = async (req, res) => {
  const { id } = req.params;

  try {
    const talla = await getTallaById(id);
    res.status(200).json(talla);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createTalla = async (req, res) => {
  const talla = req.body;

  try {
    await createTalla(talla);
    res.status(201).json({ msg: "Talla creada exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateTalla = async (req, res) => {
  const { id } = req.params;
  const talla = req.body;

  try {
    await updateTalla(id, talla);
    res.status(201).json({ msg: "Talla actualizada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.statusTalla = async (req, res) => {
  const { id } = req.params;

  try {
    await statusTalla(id);
    res.status(201).json({ msg: "Talla inactiva" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteTalla = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteTalla(id);
    res.status(201).json({ msg: "Talla eliminada" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
