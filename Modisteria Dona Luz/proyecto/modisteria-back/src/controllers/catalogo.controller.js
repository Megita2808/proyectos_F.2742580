const { Talla } = require("../models/talla.model.js");
const { Imagen } = require("../models/imagen.model.js");
const {
  getAllCatalogo,
  getCatalogoById,
  createCatalogo,
  updateCatalogo,
  deleteCatalogo,
  getCatalogoByCategoria,
  getAllCatalogoDash,
} = require("../repositories/catalogo.repository");
const {
  createCatIns,
} = require("../repositories/catalogo_insumos.repository.js");
const {
  helperImg,
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} = require("../utils/image.js");
const { CatalogoInsumos } = require("../models/catalogo_insumos.model.js");

exports.getAllCatalogo = async (req, res) => {
  try {
    const priceLimit = parseInt(req.query.price) || 250000;
    const limit = parseInt(req.query.limit) || 9;
    const page = parseInt(req.query.page) || 1;
    const category = parseInt(req.query.category) || false;
    const offset = (page - 1) * limit;
    const catalogo = await getAllCatalogo(offset, limit, priceLimit, category);
    res.status(200).json(catalogo);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
exports.getAllCatalogoDashboard = async (req, res) => {
  try {
    const catalogo = await getAllCatalogoDash();
    res.status(200).json(catalogo);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
exports.getCatalogoById = async (req, res) => {
  try {
    const { id } = req.params;
    const catalogo = await getCatalogoById(id);
    res.status(200).json(catalogo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getCatalogoByCategoria = async (req, res) => {
  const { categoriaId } = req.params;
  try {
    const catalogo = await getCatalogoByCategoria(categoriaId);
    if (catalogo.length === 0) {
      return res.status(404).json({
        error: "No se encontraron prendas en el catalogo para esta categoría",
      });
    }
    res.status(200).json(insumos);
  } catch (error) {
    console.error("Error al obtener catalogo:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los catalogo", details: error.message });
  }
};

exports.createCatalogo = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No hay archivos subidos" });
    }

    const {
      producto,
      precio,
      peso,
      descripcion,
      tallas,
      categoriaId,
      estadoId,
      linea,
    } = req.body;
    const imageUrls = [];

    for (const file of req.files) {
      const processedBuffer = await helperImg(file.buffer, 300);
      const result = await uploadToCloudinary(processedBuffer);
      imageUrls.push(result.url);
    }

    const newCatalogo = {
      producto,
      precio,
      peso,
      descripcion,
      categoriaId,
      estadoId,
      linea,
    };

    const catalogoCreado = await createCatalogo(newCatalogo);

    for (const imageUrl of imageUrls) {
      await Imagen.create({ url: imageUrl, catalogoId: catalogoCreado.id });
    }

    if (tallas) {
      const tallasInstancias = await Talla.findAll({
        where: { id: tallas.split(",") },
      });
      await catalogoCreado.addTallas(tallasInstancias);
    }

    res.status(201).json({
      msg: "Catálogo creado exitosamente",
      data: catalogoCreado,
    });
  } catch (error) {
    console.error(`Error en createCatalogo: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Error al crear el catálogo" });
  }
};
exports.updateCatalogo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      producto,
      precio,
      descripcion,
      categoriaId,
      estadoId,
      peso,
      tallas,
      linea,
    } = req.body;

    const existingCatalogo = await getCatalogoById(id);

    if (!existingCatalogo) {
      return res
        .status(404)
        .json({ success: false, message: "Catálogo no encontrado" });
    }

    const updatedCatalogo = {
      producto: producto || existingCatalogo.producto,
      precio: precio || existingCatalogo.precio,
      descripcion: descripcion || existingCatalogo.descripcion,
      categoriaId: categoriaId || existingCatalogo.categoriaId,
      estadoId: estadoId || existingCatalogo.estadoId,
      linea: linea || existingCatalogo.linea,
      peso: peso || existingCatalogo.peso,
    };

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const processedBuffer = await helperImg(file.buffer, 300);
        const result = await uploadToCloudinary(processedBuffer);
        await Imagen.create({
          url: result.url,
          catalogoId: id,
        });
      }
    }

    const [_, newCatalogo] = await updateCatalogo(id, updatedCatalogo);

    if (tallas) {
      const tallasInstancias = await Talla.findAll({
        where: { id: tallas.split(",") },
      });
      await existingCatalogo.setTallas(tallasInstancias);
    }
    await CatalogoInsumos.destroy({ where: { catalogo_id: id } });
    res
      .status(200)
      .json({ msg: "Catálogo actualizado exitosamente", data: newCatalogo[0] });
  } catch (error) {
    console.error(`Error en updateCatalogo: ${error.message}`);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar el catálogo" });
  }
};

exports.statusCatalogo = async (req, res) => {
  try {
    const { id } = req.params;
    await statusCatalogo(id);
    res.status(201).json({ msg: "Catálogo inactivo" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteCatalogo = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCatalogo(id);
    res.status(201).json({ msg: "Catálogo eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
