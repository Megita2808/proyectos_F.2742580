const mongoose = require('mongoose');

const Categoria = require('../../../modules/Catalogo/categoria');
const Producto = require('../../../modules/Catalogo/producto');
const Module = require('../../../modules/Img/imagen');

const ProductosGet = async (req, res) => {
  try {
    const productos = await Producto.find().select('nombreProducto estado imagen').exec();
    const categorias = await Categoria.find().exec();

    const categoriasMap = categorias.reduce((map, categoria) => {
      categoria.producto.forEach(productoId => {
        map[productoId] = categoria.nombreCategoria;
      });
      return map;
    }, {});

    const productosConCategoria = productos.map(producto => ({
      ...producto.toObject(),
      categoria: categoriasMap[producto._id] || 'Sin categoría'
    }));

    const productoConImagenUrl = await Promise.all(productosConCategoria.map(async producto => {
      const module = await Module.findOne({ 'images._id': producto.imagen }).exec();
      const imagenCompleta = module ? module.images.id(producto.imagen) : null;
      return {
        ...producto,
        imagen: imagenCompleta ? imagenCompleta.imageUrl : null
      };
    }));

    res.json({ productos: productoConImagenUrl });
  } catch (error) {
    console.error('Error en la obtención de productos:', error);
    res.status(500).json({ msg: 'Error al obtener los productos', error: error.message });
  }
};

const ProductosUnicoGet = async (req, res) => {
  const { id_Producto } = req.params;
  try {
    const producto = await Producto.findById(id_Producto)
      .select('nombreProducto estado imagen')
      .populate('imagen'); // Poblamos el campo de imagen

    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ProductosPost = async (req, res) => {
  const { nombreProducto, id_Categoria, imagen } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id_Categoria)) {
      return res.status(400).json({ msg: 'ID de categoría no válido' });
    }

    const categoria = await Categoria.findById(id_Categoria);
    if (!categoria) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    const nuevoProducto = new Producto({
      nombreProducto,
      imagen,
    });

    const productoGuardado = await nuevoProducto.save();

    categoria.producto.push(productoGuardado._id);
    await categoria.save();

    res.json({ msg: 'Producto registrado correctamente', producto: productoGuardado });
  } catch (error) {
    console.error(error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Error con el ID proporcionado' });
    }

    res.status(500).json({ msg: 'Error al registrar el producto', error: error.message });
  }
};

const ProductosPut = async (req, res) => {
  const { id_Producto } = req.params;
  const { nombreProducto, id_Categoria, imagen } = req.body;

  try {
    if (!id_Producto || !nombreProducto) {
      return res.status(400).json({ msg: 'Por favor, proporcione los datos completos' });
    }

    const formattedNombreProducto = nombreProducto
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());

    const productoActual = await Producto.findById(id_Producto);
    if (!productoActual) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    if (productoActual.nombreProducto !== formattedNombreProducto) {
      const productoExiste = await Producto.findOne({
        nombreProducto: formattedNombreProducto,
        _id: { $ne: id_Producto },
      });

      if (productoExiste) {
        return res.status(401).json({ msg: 'Ya existe un producto con ese nombre' });
      }
    }

    const producto = await Producto.findByIdAndUpdate(
      id_Producto,
      { nombreProducto: formattedNombreProducto, imagen },
      { new: true }
    );

    if (id_Categoria) {
      const categoria = await Categoria.findById(id_Categoria);
      if (!categoria) {
        return res.status(404).json({ msg: 'Categoría no encontrada' });
      }

      await Categoria.updateMany(
        { producto: id_Producto },
        { $pull: { producto: id_Producto } }
      );

      await Categoria.findByIdAndUpdate(
        id_Categoria,
        { $addToSet: { producto: id_Producto } }
      );
    }

    res.json({ msg: 'Producto actualizado exitosamente', producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el producto', error: error.message });
  }
};

const ProductosDelete = async (req, res) => {
  const { id_Producto } = req.params;

  try {
      const productoEliminado = await Producto.findById(id_Producto);
      if (!productoEliminado) {
          return res.status(404).json({ msg: 'Producto no encontrado' });
      }

      const categoria = await Categoria.findOne({ producto: id_Producto }).select('_id');
      
      if (categoria) {
          await Categoria.updateOne(
              { _id: categoria._id },
              { $pull: { producto: id_Producto } }
          );
      }

      await Producto.deleteOne({ _id: id_Producto });

      res.json({ msg: 'Producto eliminado exitosamente' });
  } catch (error) {
      console.error('Error detallado:', error);
      res.status(500).json({ msg: 'Error al eliminar el producto', error: error.message });
  }
};

const ProductosActualizarEstado = async (req, res) => {
  const { id_Producto } = req.params;
  const { estado } = req.body;
  
  try {
      const producto = await Producto.findByIdAndUpdate(
          id_Producto,
          { estado },
          { new: true }
      );

      if (!producto) {
          return res.status(404).json({ mensaje: 'Producto no encontrado.' });
      }

      res.json({ estado: producto.estado });
  } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al actualizar el estado del producto.', error });
  }
};

module.exports = {
  ProductosGet,
  ProductosUnicoGet,
  ProductosPost,
  ProductosPut,
  ProductosDelete,
  ProductosActualizarEstado,
};
