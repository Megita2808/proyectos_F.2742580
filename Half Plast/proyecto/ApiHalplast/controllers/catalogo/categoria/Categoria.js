const Categoria = require('../../../modules/Catalogo/categoria');
const Module = require('../../../modules/Img/imagen');

const categoriasGet = async (req, res) => {
  try {
    const { q, nombre, page = 1, limit } = req.query;

    const categorias = await Categoria.find()
      .select('nombreCategoria estado imagen');

    const categoriasConImagenUrl = await Promise.all(categorias.map(async categoria => {
      const module = await Module.findOne({ 'images._id': categoria.imagen });
      const imagenCompleta = module ? module.images.id(categoria.imagen) : null;
      return {
        ...categoria._doc,
        imagen: imagenCompleta ? imagenCompleta.imageUrl : null
      };
    }));

    res.json({
      categorias: categoriasConImagenUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las Categorías' });
  }
};

const categoriaUnicaGet = async (req, res) => {
  const { id_Categoria } = req.params;
  try {
    const categoria = await Categoria.findOne({ _id: id_Categoria })
      .select('nombreCategoria estado imagen')

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const categoriaPost = async (req, res) => {
  const { nombreCategoria, imagen } = req.body;

  const categoria = new Categoria({
    nombreCategoria,
    imagen
  });

  try {
    await categoria.save();
    res.json({ msg: "Categoría registrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar la Categoría" });
  }
};

const categoriaPut = async (req, res) => {
  try {
    const { id_Categoria } = req.params;
    const { nombreCategoria, imagen } = req.body;

    if (!id_Categoria || !nombreCategoria || !imagen) {
      return res.status(400).json({ msg: 'Por favor, proporcione los datos completos' });
    }

    const formattedNombreCategoria = nombreCategoria
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());

    const categoriaActual = await Categoria.findById(id_Categoria);
    if (!categoriaActual) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    if (categoriaActual.nombreCategoria !== formattedNombreCategoria) {
      const categoriaExiste = await Categoria.findOne({
        nombreCategoria: formattedNombreCategoria,
        _id: { $ne: id_Categoria },
      });

      if (categoriaExiste) {
        return res.status(401).json({ msg: 'Ya existe una categoría con ese nombre' });
      }
    }

    const categoria = await Categoria.findOneAndUpdate(
      { _id: id_Categoria },
      { nombreCategoria: formattedNombreCategoria, imagen },
      { new: true }
    );

    res.status(200).json({ msg: 'Categoría actualizada exitosamente', categoria });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor al actualizar la categoría' });
  }
};

const categoriaDelete = async (req, res = response) => {
  try {
    const { id_Categoria } = req.params;

    const categoria = await Categoria.findById(id_Categoria);

    if (!categoria) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    if (categoria.producto && categoria.producto.length > 0) {
      return res.status(400).json({ msg: 'La categoría no puede ser eliminada porque tiene productos asociados' });
    }

    await categoria.deleteOne();

    res.status(200).json({ msg: 'Categoría eliminada exitosamente'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor al eliminar Categoría' });
  }
};

const categoriaActualizarEstado = async (req, res) => {
  try {
    const { id_Categoria } = req.params;
    const { estado } = req.body;
    
    if (typeof estado !== 'boolean') {
      return res.status(400).json({ mensaje: 'El estado debe ser un valor booleano.' });
    }

    const categoria = await Categoria.findByIdAndUpdate(
      id_Categoria,
      { estado },
      { new: true }
    );

    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada.' });
    }

    res.json({ estado: categoria.estado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el estado de la categoría.', error });
  }
};

module.exports = {
  categoriasGet,
  categoriaUnicaGet,
  categoriaPost,
  categoriaPut,
  categoriaDelete,
  categoriaActualizarEstado,
};