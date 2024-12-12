const { STATE_PRENDAS_ACTIVO } = require("../constants/constants");
const cloudinary = require("cloudinary").v2;
const {
  getAllCategoriaPrendas,
  getCategoriaPrendaById,
  createCategoriaPrenda,
  updateCategoriaPrenda,
  deleteCategoriaPrenda,
  statusCategoriaPrenda,
} = require("../repositories/categoria_prendas.repository");
const { getPublicIdFromUrl } = require("../utils/image");
const {  gestionPDF } = require("../utils/pdf");
const multer = require("multer");

exports.getAllCategoriaPrendas = async (req, res) => {
  try {
    const type = req.query.type || false;

    const categorias = await getAllCategoriaPrendas(type);
    res.status(200).json(categorias);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getCategoriaPrendaById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await getCategoriaPrendaById(id);
    res.status(200).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCategoriaPrenda = async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const nuevaCategoria = await createCategoriaPrenda({
      nombre,
      descripcion,
      estadoId: STATE_PRENDAS_ACTIVO,
      molde: req.fileUrl || null,
    });

    res.status(201).json({ msg: "Categoría creada exitosamente", nuevaCategoria });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategoriaPrenda = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estadoId } = req.body;
  let moldeUrl = null;

  try {
    const categoriaExistente = await getCategoriaPrendaById(id);

    if (!categoriaExistente) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    if (req.fileUrl) {
      if (categoriaExistente.molde) {
        const publicId = getPublicIdFromUrl(categoriaExistente.molde);
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      }

      moldeUrl = req.fileUrl; 
    } else {
      moldeUrl = categoriaExistente.molde;
    }

    const updatedCategoria = await updateCategoriaPrenda(id, {
      nombre: nombre || categoriaExistente.nombre,
      descripcion: descripcion || categoriaExistente.descripcion,
      estadoId: estadoId || categoriaExistente.estadoId,
      molde: moldeUrl,
    });

    res.status(200).json({ msg: "Categoría actualizada exitosamente", updatedCategoria });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.statusCategoriaPrenda = async (req, res) => {
  const { id } = req.params;
  try {
    await statusCategoriaPrenda(id);
    res.status(201).json({ msg: "Categoría inactiva" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategoriaPrenda = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCategoriaPrenda(id);
    res.status(201).json({ msg: "Categoría eliminada" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
