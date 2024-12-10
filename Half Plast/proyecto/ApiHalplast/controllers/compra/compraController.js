const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Compra = require('../../modules/compra/compraModule');

const MedidaProducto = require('../../modules/Catalogo/medidaProducto');
const PrecioVenta = require('../../modules/precioVenta/PrecioVentaModulo');
const Proveedor = require('../../modules/unidadMedida/UnidadesMedidaModulo');

const { CrearExistenciasMedidaProducto } = require('../catalogo/medidaProducto/MedidaProductoController')

const comprasGet = async (req, res) => { 
  try {
    const compras = await Compra.find()
      .populate({
        path: 'detalleCompra.medidaProducto',
        model: 'MedidaProducto',
        select: '-estado',
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
            ],
          },
          {
            path: 'colores.existencias.equivalencia.unidadMedida',
            model: 'UnidadMedida',
            select: '_id nombre simbolo',
          },
        ],
      })
      .populate({
        path: 'detalleCompra.proveedor',
        model: 'Proveedor',
        select: '_id nombre',
      })
      .populate({
        path: 'detalleCompra.color',
        model: 'PrecioVenta',
        select: '-estado',
      });

    res.json({
      compras,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las Compras' });
  }
};

const compraUnicaGet = async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID inválido' });
  }

  try {
    const compra = await Compra.findById(id)
    .populate({
        path: 'detalleCompra.medidaProducto',
        model: 'MedidaProducto',
        select: '-estado',
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
          }
        ]
      })
      .populate('detalleCompra.proveedor', '_id nombre')

    if (!compra) {
      return res.status(404).json({ msg: 'Compra no encontrada' });
    }

    res.json(compra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la Compra' });
  }
};

const compraPost = async (req, res) => {
  const { detalleCompra, estado = true } = req.body;

  if (!Array.isArray(detalleCompra) || detalleCompra.length === 0) {
    return res.status(400).json({ msg: 'Detalle de compra debe ser una lista no vacía' });
  }

  for (const detalle of detalleCompra) {
    if (
      !mongoose.Types.ObjectId.isValid(detalle.medidaProducto) ||
      !mongoose.Types.ObjectId.isValid(detalle.color) ||
      !mongoose.Types.ObjectId.isValid(detalle.proveedor) ||
      !Number.isInteger(detalle.cantidad) || detalle.cantidad <= 0 ||
      typeof detalle.total !== 'number' || detalle.total < 0
    ) {
      return res.status(400).json({ msg: 'Datos de entrada inválidos en uno o más elementos de detalleCompra' });
    } else {
      const medidaDatoCompleto = await MedidaProducto.findById(detalle.medidaProducto);

      if (medidaDatoCompleto) {
        const color = medidaDatoCompleto.colores.find(c => c.PrecioVenta.toString() === detalle.color.toString());
        CrearExistenciasMedidaProducto(detalle.medidaProducto, color.PrecioVenta, detalle.cantidad)
        if (color) {
          color.existencias.cantidad = detalle.cantidad;
        }
      }
      await medidaDatoCompleto.save();
    }
  }

  const compra = new Compra({
    detalleCompra,
    fechaCompra: Date.now(),
    estado
  });

  try {
    await compra.save();
    res.status(201).json({ msg: 'Compra registrada correctamente', compra });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al registrar la Compra' });
  }
};

const compraPut = async (req, res) => {
  const { id } = req.params;
  const { medidaProducto, color, cantidad, total, proveedor } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID inválido' });
  }

  if (!mongoose.Types.ObjectId.isValid(medidaProducto) ||
      !mongoose.Types.ObjectId.isValid(color) ||
      !mongoose.Types.ObjectId.isValid(proveedor) ||
      !Number.isInteger(cantidad) || cantidad <= 0 ||
      typeof total !== 'number' || total < 0) {
    return res.status(400).json({ msg: 'Datos de entrada inválidos' });
  }

  try {
    const compra = await Compra.findByIdAndUpdate(
      id,
      { medidaProducto, color, cantidad, total, proveedor },
      { new: true, runValidators: true }
    );

    if (!compra) {
      return res.status(404).json({ msg: 'Compra no encontrada' });
    }

    res.json({ msg: 'Compra actualizada exitosamente', compra });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor al actualizar la compra' });
  }
};

const compraDelete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID inválido' });
  }

  try {
    const compra = await Compra.findByIdAndDelete(id);

    if (!compra) {
      return res.status(404).json({ msg: 'Compra no encontrada' });
    }

    res.json({ msg: 'Compra eliminada exitosamente', compra });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor al eliminar la compra' });
  }
};

const compraActualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID inválido' });
  }

  if (typeof estado !== 'boolean') {
    return res.status(400).json({ msg: 'El estado debe ser un valor booleano.' });
  }

  try {
    const compra = await Compra.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!compra) {
      return res.status(404).json({ msg: 'Compra no encontrada.' });
    }

    res.json({ msg: 'Estado actualizado exitosamente', estado: compra.estado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el estado de la compra.' });
  }
};

module.exports = {
  comprasGet,
  compraUnicaGet,
  compraPost,
  compraPut,
  compraDelete,
  compraActualizarEstado,
};
