const {
  getAllCategoriaInsumos,
  getCategoriaInsumoById,
  createCategoriaInsumo,
  updateCategoriaInsumo,
  deleteCategoriaInsumo,
  statusCategoriaInsumo,
  getCategoriaInsumoByTipo,
} = require("../repositories/categoria_insumos.repository");

exports.getAllCategoriaInsumos = async (req, res) => {
  try {
    const type = req.query.type || false;

    const categorias = await getAllCategoriaInsumos(type);
    res.status(200).json(categorias);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getCategoriaInsumoById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await getCategoriaInsumoById(id);
    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCategoriaInsumo = async (req, res) => {
  const categoria = req.body;

  try {
    await createCategoriaInsumo(categoria);
    res.status(201).json({ msg: "Categoría creada exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateCategoriaInsumo = async (req, res) => {
  const { id } = req.params;
  const categoria = req.body;

  try {
    await updateCategoriaInsumo(id, categoria);
    res.status(201).json({ msg: "Categoría actualizada exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.statusCategoriaInsumo = async (req, res) => {
  const { id } = req.params;
  try {
    await statusCategoriaInsumo(id);
    res.status(201).json({ msg: "Categoría inactiva" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteCategoriaInsumo = async (req, res) => {
  const { id } = req.params; 
  try {
    await deleteCategoriaInsumo(id);
    res.status(201).json({ msg: "Categoría eliminada" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getCategoriaInsumoByTipo = async (req, res) => {
  const { tipo } = req.params;
  try {
    const categorias = await getCategoriaInsumoByTipo(tipo);
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json(error);
  }
};
