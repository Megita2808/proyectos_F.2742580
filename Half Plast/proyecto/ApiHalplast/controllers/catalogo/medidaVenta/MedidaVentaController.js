const mongoose = require('mongoose');
const MedidaProducto = require('../../../modules/Catalogo/medidaProducto');
const MedidaVenta = require('../../../modules/Catalogo/medidaVenta');
const Module = require('../../../modules/Img/imagen');
const Venta = require('../../../modules/venta/ventaModule');
const Compra = require('../../../modules/compra/compraModule');

const MedidasVentaGet = async (req, res) => {
  try {
    const medidasVenta = await MedidaVenta.find()
      .populate({ path: 'longitudMedida.unidadMedida', model: 'UnidadMedida', select: '_id nombre simbolo' })
      .populate({ path: 'peso.unidadMedida', model: 'UnidadMedida', select: '_id nombre simbolo' })
      .populate({ path: 'peso.valores.valor', model: 'Peso', select: '_id peso unidadMedida',            })
      .populate({
        path: 'colores.PrecioVenta',
        model: 'PrecioVenta',
        select: '_id precioUnitario',
        populate: {
          path: 'color',
          model: 'Color',
          select: '_id nombreColor'
        }
      })
      .populate({
        path: 'colores.PrecioVenta',
        model: 'PrecioVenta',
        populate: {
          path: 'unidadMedida',
          model: 'UnidadMedida',
          select: '_id nombre simbolo'
        }
      })
      .exec();

    const medidasVentaConImagenes = await Promise.all(medidasVenta.map(async medidaVenta => {
      const coloresConImagenes = await Promise.all(medidaVenta.colores.map(async color => {
        const module = await Module.findOne({ 'images._id': color.imagen }).exec();
        const imagenCompleta = module ? module.images.id(color.imagen) : null;

        return {
          ...color.toObject(),
          idImagen: imagenCompleta ? color.imagen : null,
          imagen: imagenCompleta ? imagenCompleta.imageUrl : null
        };
      }));

      return {
        ...medidaVenta.toObject(),
        colores: coloresConImagenes
      };
    }));

    const medidasProducto = await MedidaProducto.find().populate({ path: 'longitudMedida.unidadMedida', model: 'UnidadMedida', select: '_id nombre simbolo' }).exec();

    const MedidasProductoMap = medidasProducto.reduce((map, medidaProducto) => {
      medidaProducto.medidaVenta.forEach(id_MedidaVenta => {
        map[id_MedidaVenta.toString()] = {
          longitudMedida: {
            valor: medidaProducto.longitudMedida.valor,
            unidadMedida: medidaProducto.longitudMedida.unidadMedida, 
          },
          idMedidaProducto: medidaProducto._id
        };
      });
      return map;
    }, {});
    
    const medidasVentaConMedidaProducto = medidasVentaConImagenes.map(medidaVenta => ({
      ...medidaVenta,
      medidaProducto: MedidasProductoMap[medidaVenta._id] || 'Sin medida producto'
    }));

    res.json({ medidasVenta: medidasVentaConMedidaProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las medidas', error: error.message });
  }
};

const MedidaVentaUnicoGet = async (req, res) => {
  const { id_MedidaVenta } = req.params;
  try {
    const medidaVenta = await MedidaVenta.findById(id_MedidaVenta)
      .populate('longitudMedida.unidadMedida')
      .populate('peso.unidadMedida')
      .populate('colores.color')
      .populate('colores.PrecioVenta')
      .populate('colores.imagenes.imagen')
      .exec();

    if (!medidaVenta) {
      return res.status(404).json({ msg: 'Medida de venta no encontrada' });
    }

    const medidasProducto = await MedidaProducto.find().exec();
    
    const MedidasProductoMap = medidasProducto.reduce((map, medidaProducto) => {
      medidaProducto.medidaVenta.forEach(id_MedidaVenta => {
        map[id_MedidaVenta] = medidaProducto.longitudMedida.populate('unidadMedida');
      });
      return map;
    }, {});

    const medidasVentaConMedidaProducto = medidasVenta.map(medidaVenta => ({
      ...medidaVenta.toObject(),
      medidaProducto: MedidasProductoMap[medidaVenta._id] || 'Sin medida producto'
    }));

    const mediVenConMediprodConImagen = await Promise.all(medidasVentaConMedidaProducto.map(async medidaVenta => {
      const module = await Module.findOne({ 'images._id': medidaVenta.valores.referencias.referencia }).exec();
      const imagenCompleta = module ? module.images.id(medidaVenta.valores.referencias.referencia ) : null;
      return {
        ...medidaVenta,
        imagen: imagenCompleta ? imagenCompleta.imageUrl : null
      };
    }));

    res.json(mediVenConMediprodConImagen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const MedidaVentaPost = async (req, res) => {
  const { id_MedidaProducto, longitudMedida, peso, colores } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id_MedidaProducto)) {
      return res.status(400).json({ msg: 'ID de medida producto no válido' });
    }

    const medidaProducto = await MedidaProducto.findById(id_MedidaProducto);
    if (!medidaProducto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    let medidaVentaExistente = null;
    for (const medidaVentaId of medidaProducto.medidaVenta) {
      const medidaVenta = await MedidaVenta.findById(medidaVentaId);
      if (
        medidaVenta &&
        medidaVenta.longitudMedida.valor == longitudMedida.valor &&
        medidaVenta.longitudMedida.unidadMedida == longitudMedida.unidadMedida
      ) {
        medidaVentaExistente = medidaVenta;
        break;
      }
    }

    if (medidaVentaExistente) {
      return res.status(401).json({ msg: 'Ya existe una medida de venta con esa longitud y unidad de medida para este producto' });
    }

    const nuevaMedidaVenta = new MedidaVenta({
      longitudMedida,
      peso,
      colores,
    });

    const medidaVentaGuardada = await nuevaMedidaVenta.save();

    medidaProducto.medidaVenta.push(medidaVentaGuardada._id);
    await medidaProducto.save();

    res.json({ msg: 'Medida de venta registrada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al registrar la medida de venta', error: error.message });
  }
};

const MedidaVentaPut = async (req, res) => {
  const { id_MedidaVenta } = req.params;
  const { id_MedidaProducto, longitudMedida, peso, colores } = req.body;

  try {
    const medidaVenta = await MedidaVenta.findById(id_MedidaVenta);
    if (!medidaVenta) {
      return res.status(404).json({ msg: 'Medida de venta no encontrada' });
    }

    const medidaVentaExistente = await MedidaVenta.findOne({
      _id: { $ne: id_MedidaVenta },
      'longitudMedida.valor': longitudMedida.valor,
      'longitudMedida.unidadMedida': longitudMedida.unidadMedida,
      _id: { $in: medidaVenta.medidaProducto }
    });

    if (medidaVentaExistente) {
      return res.status(400).json({ msg: 'Ya existe una medida de venta con esa longitud y unidad de medida en este producto' });
    }

    const medidaVentaActualizada = await MedidaVenta.findByIdAndUpdate(
      id_MedidaVenta,
      { longitudMedida, peso, colores },
      { new: true }
    ).exec();

    if (!medidaVentaActualizada) {
      return res.status(404).json({ msg: 'Medida de venta no encontrada' });
    }

    if (id_MedidaProducto) {
      const medidaProducto = await MedidaProducto.findById(id_MedidaProducto);
      if (!medidaProducto) {
        return res.status(404).json({ msg: 'Medida producto no encontrada' });
      }

      await medidaProducto.updateOne(
        { $push: { medidaVenta: id_MedidaVenta } }
      );
    }

    res.json({ msg: 'Medida de venta actualizada exitosamente', medidaVenta: medidaVentaActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar la medida de venta', error: error.message });
  }
};

const MedidaVentaDelete = async (req, res) => {
  const { id_MedidaVenta } = req.params;

  try {

    const existeEnVenta = await Venta.findOne({ "detalleVenta.medidasVenta.medida" : id_MedidaVenta });

    if (existeEnVenta) {
      return res.status(400).json({ msg: 'La medida no puede ser eliminado porque está asociado a una o más ventas.' });
    }

    const medidaVentaEliminada = await MedidaVenta.findByIdAndDelete(id_MedidaVenta).exec();

    if (!medidaVentaEliminada) {
      return res.status(404).json({ msg: 'Medida de venta no encontrada' });
    }

    await MedidaProducto.updateMany(
      { medidaVenta: id_MedidaVenta },
      { $pull: { medidaVenta: id_MedidaVenta } }
    );

    res.json({ msg: 'Medida de venta eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la medida de venta', error: error.message });
  }
};

const MedidaVentaActualizarEstado = async (req, res) => {
  const { id_MedidaVenta } = req.params;
  const { estado } = req.body;

  try {
    const medidaVenta = await MedidaVenta.findByIdAndUpdate(
      id_MedidaVenta,
      { estado },
      { new: true }
    ).exec();

    if (!medidaVenta) {
      return res.status(404).json({ msg: 'Medida de venta no encontrada' });
    }

    res.json({ msg: 'Estado actualizado exitosamente', estado: medidaVenta.estado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el estado de la medida de venta', error: error.message });
  }
};

module.exports = {
  MedidasVentaGet,
  MedidaVentaUnicoGet,
  MedidaVentaPost,
  MedidaVentaPut,
  MedidaVentaDelete,
  MedidaVentaActualizarEstado,
};
