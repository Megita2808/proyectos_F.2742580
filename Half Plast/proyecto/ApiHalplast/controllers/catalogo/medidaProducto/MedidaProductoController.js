const mongoose = require('mongoose');
const Producto = require('../../../modules/Catalogo/producto');
const MedidaProducto = require('../../../modules/Catalogo/medidaProducto');
const PrecioVenta = require('../../../modules/precioVenta/PrecioVentaModulo');
const UnidadMedida = require('../../../modules/unidadMedida/UnidadesMedidaModulo');
const Peso = require('../../../modules/Catalogo/peso');
const Color = require('../../../modules/Catalogo/color');
const MedidaVenta = require('../../../modules/Catalogo/medidaVenta');
const Venta = require('../../../modules/venta/ventaModule');
const Compra = require('../../../modules/compra/compraModule');

const MedidasProductoGet = async (req, res) => {
  try {
    const medidasProducto = await MedidaProducto.find()
      .populate({ path: 'longitudMedida.unidadMedida', model: 'UnidadMedida' })
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
      .populate({
        path: 'colores.existencias.equivalencia.unidadMedida',
        model: 'UnidadMedida',
        select: '_id nombre simbolo',
      })
      .populate({ path: 'peso.valores.valor', model: 'Peso', select: '_id peso' })
      .populate({ path: 'peso.unidadMedida', model: 'UnidadMedida', select: '_id nombre simbolo' });

    const productos = await Producto.find().exec();

    const productosMap = productos.reduce((map, producto) => {
      producto.medidaProducto.forEach(medidaProductoId => {
        map[medidaProductoId.toString()] = {
          nombreProducto: producto.nombreProducto,
          idProducto: producto._id
        };
      });
      return map;
    }, {});

    const medidasProductoConProducto = medidasProducto.map(medidaProducto => ({
      ...medidaProducto._doc,
      producto: productosMap[medidaProducto._id.toString()] || { nombreProducto: 'Sin producto', idProducto: null },
    }));

    res.json({ medidasProducto: medidasProductoConProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las medidas', error: error.message });
  }
};

const MedidasProductoConMedidaVentaGet = async (req, res) => {
  try {
    const medidasProducto = await MedidaProducto.find()
      .populate({
        path: 'medidaVenta',
        model: 'MedidaVenta',
        select: '_id longitudMedida peso colores',
        populate: [
          {
            path: 'longitudMedida.unidadMedida',
            model: 'UnidadMedida',
            select: '_id nombre simbolo',
          },
          {
            path: 'peso.valores.valor',
            model: 'Peso',
            select: '_id peso',
            // select: '_id peso unidadMedida',
            // populate: {
            //   path: 'unidadMedida',
            //   model: 'UnidadMedida',
            //   select: '_id nombre simbolo',
            // },
          },
          {
            path: 'peso.unidadMedida',
            model: 'UnidadMedida',
            select: '_id nombre simbolo',
          },
          {
            path: 'colores.PrecioVenta',
            model: 'PrecioVenta',
            select: '_id precioUnitario unidadMedida color',
            populate: [
              {
                path: 'unidadMedida',
                model: 'UnidadMedida',
                select: '_id nombre simbolo',
              },
              {
                path: 'color',
                model: 'Color',
                select: '_id nombreColor',
              },
            ]
          },
        ]
      })
      .populate({ path: 'longitudMedida.unidadMedida', model: 'UnidadMedida', select: '_id nombre simbolo', })
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
      .populate({
        path: 'colores.existencias.equivalencia.unidadMedida',
        model: 'UnidadMedida',
        select: '_id nombre simbolo',
      })
      .populate({ path: 'peso.valores.valor', model: 'Peso', select: '_id peso' })
      .populate({ path: 'peso.unidadMedida', model: 'UnidadMedida', select: '_id nombre simbolo' });

    const productos = await Producto.find().exec();

    const productosMap = productos.reduce((map, producto) => {
      producto.medidaProducto.forEach(medidaProductoId => {
        map[medidaProductoId.toString()] = {
          nombreProducto: producto.nombreProducto,
          idProducto: producto._id
        };
      });
      return map;
    }, {});

    const medidasProductoConProducto = medidasProducto.map(medidaProducto => ({
      ...medidaProducto._doc,
      producto: productosMap[medidaProducto._id.toString()] || { nombreProducto: 'Sin producto', idProducto: null },
    }));

    res.json({ medidasProducto: medidasProductoConProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las medidas', error: error.message });
  }
};

const MedidasProductoHabilitadosGet = async (req, res) => {
  try {
    const medidasProducto = await MedidaProducto.find({ 'estado': true }).select('_id longitudMedida')
      .populate({ path: 'longitudMedida.unidadMedida', model: 'UnidadMedida' })

    res.json({ medidasProducto: medidasProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las medidas', error: error.message });
  }
};

const MedidaProductoUnicoGet = async (req, res) => {
  const { id_MedidaProducto } = req.params;
  try {
    const medidaProducto = await MedidaProducto.findById(id_MedidaProducto)
    .populate({ path: 'longitudMedida.unidadMedida', model: 'UnidadMedida' })
    .populate({ path: 'colores.PrecioVenta', model: 'PrecioVenta' })
    .populate({ path: 'peso.valores.valor', model: 'Peso' })
    .populate({ path: 'peso.unidadMedida', model: 'UnidadMedida' });
    res.json(medidaProducto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const MedidaProductoPost = async (req, res) => {
  const { longitudMedida, id_Producto, colores, peso } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id_Producto)) {
      return res.status(400).json({ msg: 'ID de producto no válido' });
    }

    const producto = await Producto.findById(id_Producto);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (!peso || peso.valores.length !== 1) {
      return res.status(400).json({ error: 'Debe enviarse exactamente un peso válido' });
    }

    let medidaProductoExistente = null;
    for (const medidaProductoId of producto.medidaProducto) {
      const medidaProducto = await MedidaProducto.findById(medidaProductoId);
      if (
        medidaProducto &&
        medidaProducto.longitudMedida.valor == longitudMedida.valor &&
        medidaProducto.longitudMedida.unidadMedida == longitudMedida.unidadMedida
      ) {
        medidaProductoExistente = medidaProducto;
        break;
      }
    }

    if (medidaProductoExistente) {
      return res.status(400).json({ error: 'El producto ya tiene esta longitud medida registrada' });
    }

    const nuevaMedidaProducto = new MedidaProducto({
      longitudMedida: {
        valor: longitudMedida.valor,
        unidadMedida: longitudMedida.unidadMedida,
      },
      peso: {
        valores: [{ valor: peso.valores[0].valor }],
        unidadMedida: peso.unidadMedida,
      },
      colores,
      estado: false,
    });

    const medidaProductoGuardada = await nuevaMedidaProducto.save();
    producto.medidaProducto.push(medidaProductoGuardada._id);
    await producto.save();

    res.json({
      msg: 'Medida de producto registrada correctamente',
      medidaProducto: medidaProductoGuardada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al registrar la medida de producto',
      details: error.message,
    });
  }
};

const MedidaProductoPut = async (req, res) => {
  const { id_MedidaProducto } = req.params;
  const { longitudMedida, id_Producto, colores, peso } = req.body;

  try {
    const medidaProductoExistente = await MedidaProducto.findOne({
      _id: { $ne: id_MedidaProducto },
      id_Producto: id_Producto,
      'longitudMedida.valor': longitudMedida.valor,
      'longitudMedida.unidadMedida': longitudMedida.unidadMedida,
      estado: true,
    });

    if (medidaProductoExistente) {
      return res.status(400).json({ msg: 'El producto ya tiene esta longitud medida registrada' });
    }

    if (peso.valores.length > 1) {
      return res.status(400).json({ msg: 'Solo se permite enviar un peso a la vez' });
    }

    const medidaProducto = await MedidaProducto.findByIdAndUpdate(
      id_MedidaProducto,
      {
        longitudMedida: {
          valor: longitudMedida.valor,
          unidadMedida: longitudMedida.unidadMedida
        },
        peso: {
          valores: peso.valores.length > 0 ? [{ valor: peso.valores[0].valor }] : [],
          unidadMedida: peso.unidadMedida
        },
        colores
      },
      { new: true }
    );

    if (!medidaProducto) {
      return res.status(404).json({ msg: 'Medida de producto no encontrada' });
    }

    if (id_Producto) {
      const producto = await Producto.findById(id_Producto);

      if (!producto) {
        return res.status(404).json({ msg: 'Producto no encontrado' });
      }

      await Producto.updateMany(
        { medidaProducto: id_MedidaProducto },
        { $pull: { medidaProducto: id_MedidaProducto } }
      );
      await Producto.findByIdAndUpdate(
        id_Producto,
        { $addToSet: { medidaProducto: id_MedidaProducto } }
      );
    }

    res.json({ msg: 'Medida de producto actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar la medida de producto', error: error.message });
  }
};

const MedidaProductoDelete = async (req, res) => {
  const { id_MedidaProducto } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(id_MedidaProducto)){

      const medidaProductoEliminado = await MedidaProducto.findById(id_MedidaProducto);
      if (!medidaProductoEliminado) {
        return res.status(401).json({ msg: 'Medida de producto no encontrada' });
      }

      const existeEnVenta = await Venta.findOne({ "detalleVenta.medidasProducto.medida" : id_MedidaProducto });

      if (existeEnVenta) {
        return res.status(400).json({ msg: 'La medida no puede ser eliminado porque está asociado a una o más ventas.' });
      }
      
      if (!existeEnVenta){
        const existeEnCompra = await Compra.findOne({ "detalleCompra.medidaProducto" : id_MedidaProducto });
  
        if (existeEnCompra) {
          return res.status(400).json({ msg: 'La medida no puede ser eliminado porque está asociado a una o más compras.' });
        }  
      }
  
      const producto = await Producto.findOne({ medidaProducto: id_MedidaProducto }).select('_id');
      if (!producto) {
        return res.status(402).json({ msg: 'Producto no encontrado' });
      }

      if (producto.medidaProducto && producto.medidaProducto.length > 0) {
        return res.status(403).json({ msg: 'El producto no puede ser eliminada porque tiene medidas asociadas' });
      }
  
      await Producto.updateOne(
        { _id: producto._id },
        { $pull: { medidaProducto: id_MedidaProducto } }
      );
  
      await MedidaProducto.deleteOne({ _id: id_MedidaProducto });
  
      res.json({ msg: 'Medida producto eliminada exitosamente' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la medida de producto' });
  }
};

const MedidaProductoActualizarEstado = async (req, res) => {
  const { id_MedidaProducto } = req.params;
  const { estado } = req.body;

  try {
    const medidaProducto = await MedidaProducto.findByIdAndUpdate(
      id_MedidaProducto,
      { estado },
      { new: true }
    );

    if (!medidaProducto) {
      return res.status(404).json({ mensaje: 'Medida de producto no encontrada' });
    }

    res.json({ estado: medidaProducto.estado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado de la Medida de producto.', error });
  }
};

const CrearExistenciasMedidaProducto = async (idMedidaProducto, idPrecioVenta, cantidad) => {
  try {
    const medidaDatoCompleto = await MedidaProducto.findById(idMedidaProducto);
    if (!medidaDatoCompleto) throw new Error("MedidaProducto no encontrada.");

    const precioVenta = await PrecioVenta.findById(idPrecioVenta);
    if (!precioVenta) throw new Error("PrecioVenta no encontrada.");

    const color = medidaDatoCompleto.colores.find(c => c.PrecioVenta.toString() === idPrecioVenta.toString());
    if (!color) throw new Error("Color no encontrado en MedidaProducto.");

    const unidadMedida = await UnidadMedida.findById(precioVenta.unidadMedida);
    if (!unidadMedida) throw new Error("UnidadMedida no encontrada.");

    let equivalencia = 1;

    switch (unidadMedida.tipo) {
      case 'longitud':
        equivalencia = medidaDatoCompleto.longitudMedida.valor * cantidad;
        break;

      case 'Unic':
        equivalencia = cantidad;
        break;

      case 'peso':
        const pesoDatos = await Peso.findById(medidaDatoCompleto.peso.valores[0].valor);

        const unidadMedidaPeso = await UnidadMedida.findById(pesoDatos.unidadMedida);
        if (!unidadMedidaPeso) throw new Error("UnidadMedida no encontrada para el peso.");

        const multiplicador = ( pesoDatos.peso *  obtenerMultiplicador(unidadMedidaPeso.simbolo, unidadMedida.simbolo) );

        equivalencia = multiplicador * cantidad;
        break;

      default:
        throw new Error(`Tipo de unidad no reconocido: ${unidadMedida.tipo}`);
    }

    color.existencias.equivalencia.valor += equivalencia;
    color.existencias.equivalencia.unidadMedida = unidadMedida._id;
    
    await medidaDatoCompleto.save();
    
  } catch (error) {
    console.error("Error en CrearExistenciasMedidaProducto:", error.message);
  }
};
const obtenerMultiplicador = (unidadPeso, unidadCosto) => {
  if (unidadPeso === 'gm') {
    if (unidadCosto === 'gm') return 1;
    if (unidadCosto === 'Kg') return 0.001;
    if (unidadCosto === 'Tn') return 0.000001;
  } else if (unidadPeso === 'Kg') {
    if (unidadCosto === 'gm') return 1000;
    if (unidadCosto === 'Kg') return 1;
    if (unidadCosto === 'Tn') return 0.001;
  } else if (unidadPeso === 'Tn') {
    if (unidadCosto === 'gm') return 1000000;
    if (unidadCosto === 'Kg') return 1000;
    if (unidadCosto === 'Tn') return 1;
  }
  return 1;
};

const obtenerMultiplicadorLongitud = (unidadPeso, unidadCosto) => {
  if (unidadPeso === 'gm') {
    if (unidadCosto === 'gm') return 1;
    if (unidadCosto === 'Kg') return 0.001;
    if (unidadCosto === 'Tn') return 0.000001;
  } else if (unidadPeso === 'Kg') {
    if (unidadCosto === 'gm') return 1000;
    if (unidadCosto === 'Kg') return 1;
    if (unidadCosto === 'Tn') return 0.001;
  } else if (unidadPeso === 'Tn') {
    if (unidadCosto === 'gm') return 1000000;
    if (unidadCosto === 'Kg') return 1000;
    if (unidadCosto === 'Tn') return 1;
  }
  return 1;
};

const RestaExistenciasMedidaProducto = async (idMedidaProducto, idMedidaVenta, longitudPersonalizada ,pesoPersonalizado, idPrecioVenta, cantidad) => {
  try {
    
    const medidaDatoCompleto = await MedidaProducto.findById(idMedidaProducto);
    if (!medidaDatoCompleto) throw new Error("MedidaProducto no encontrada.");

    console.log('parte 1')
    let precioVenta = await PrecioVenta.findById(idPrecioVenta);
    if (!precioVenta) throw new Error("PrecioVenta no encontrada principal.");
    console.log(precioVenta)
    console.log('parte 2')
    let color = medidaDatoCompleto.colores.find(c => c.PrecioVenta.toString() === idPrecioVenta.toString());
    console.log(color)
    if (!color) {      
      let ColorIdentificador = await Color.findById(precioVenta.color);
      
      if (ColorIdentificador) {
        precioVenta = await PrecioVenta.find({ color: ColorIdentificador._id });
      } else {
        throw new Error("Color no encontrado.");
      }
      precioVenta = precioVenta.find(precioVentaUnico => 
        medidaDatoCompleto.colores.find(c => c.PrecioVenta.toString() ===  precioVentaUnico.id)
      )
      if (!precioVenta) throw new Error("Precio de venta no encontrado secundario.");

      color = medidaDatoCompleto.colores.find(c => c.PrecioVenta.toString() === precioVenta._id.toString());
      if (!color) throw new Error("Color no encontrado en MedidaProducto.");
    }
    console.log('parte 3')
    const unidadMedida = await UnidadMedida.findById(precioVenta.unidadMedida);
    if (!unidadMedida) throw new Error("UnidadMedida no encontrada.");
    console.log(unidadMedida)

    let equivalencia = color.existencias.equivalencia.valor;

    switch (unidadMedida.tipo) {
      case 'longitud':

        if(unidadMedida.simbolo === '½' && idMedidaProducto !== idMedidaVenta){
          const medidaVentaCompleto = await MedidaVenta.findById(idMedidaVenta);
          if (!medidaVentaCompleto) throw new Error("MedidaProducto no encontrada.");
          equivalencia = ( medidaDatoCompleto.longitudMedida.valor * medidaVentaCompleto.longitudMedida.valor ) * cantidad;
        }else if (typeof longitudPersonalizada === 'object' && (unidadMedida.simbolo === 'Mt²' || unidadMedida.simbolo === 'mt')){
          equivalencia = ( longitudPersonalizada.ancho * longitudPersonalizada.largo ) * cantidad;
        }else{
          equivalencia = medidaDatoCompleto.longitudMedida.valor * cantidad;
        }
        break;

      case 'Unic':
        equivalencia = cantidad;
        break;

      case 'peso':
        let pesoDatos
        let unidadMedidaPeso
        if (typeof pesoPersonalizado === 'object' ){
          pesoDatos = { peso : pesoPersonalizado.valor };
          unidadMedidaPeso = { simbolo : pesoPersonalizado.unidad }
        }else {
          pesoDatos = await Peso.findById(pesoPersonalizado);
          unidadMedidaPeso = await UnidadMedida.findById(pesoDatos.unidadMedida);
          if (!unidadMedidaPeso) throw new Error("UnidadMedida no encontrada para el peso.");
        }

        equivalencia = ( pesoDatos.peso *  obtenerMultiplicador(unidadMedidaPeso.simbolo, unidadMedida.simbolo) )* cantidad;
        break;

      default:
        throw new Error(`Tipo de unidad no reconocido: ${unidadMedida.tipo}`);
    }

    const porcentajeRestante = (color.existencias.equivalencia.valor - equivalencia) / color.existencias.equivalencia.valor;

    color.existencias.equivalencia.valor -= equivalencia; 
    color.existencias.cantidad *= porcentajeRestante;
    
    await medidaDatoCompleto.save();

  } catch (error) {
    console.error("Error en restar existencias:", error.message);
  }
};

module.exports = {
  MedidasProductoGet,
  MedidasProductoConMedidaVentaGet,
  MedidaProductoUnicoGet,
  MedidaProductoPost,
  MedidaProductoPut,
  MedidaProductoDelete,
  MedidaProductoActualizarEstado,
  MedidasProductoHabilitadosGet,
  CrearExistenciasMedidaProducto,
  RestaExistenciasMedidaProducto
};
