const { response } = require("express");
const PrecioVenta = require('../../modules/precioVenta/PrecioVentaModulo');
const UnidadMedida = require('../unidadMedida/unidadMedidaController');
const Color = require('../catalogo/color/ColorController');

const precioVentaGet = async (req, res = response) => {
    try {
        const preciosVenta = await PrecioVenta.find()
        .populate({ path: 'unidadMedida', model: 'UnidadMedida' })
        .populate({ path: 'color', model: 'Color' })
        
        res.json({
            preciosVenta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los precios de venta' });
    }
};

const precioVentaPost = async (req, res = response) => {
    const { precioUnitario, unidadMedida, color } = req.body;
    const nuevoPrecioVenta = new PrecioVenta({ precioUnitario, unidadMedida, color });

    try {
        await nuevoPrecioVenta.save();
        res.json({ msg: 'Precio de venta registrado correctamente', nuevoPrecioVenta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al registrar el precio de venta' });
    }
};

const precioVentaPut = async (req, res = response) => {
    const { id } = req.params;
    const { precioUnitario, unidadMedida, color } = req.body;
    
    try {
        const precioVenta = await PrecioVenta.findByIdAndUpdate(
            id,
            { precioUnitario, unidadMedida, color },
            { new: true }
        ).populate('unidadMedida').populate('color');
        
        if (!precioVenta) {
            return res.status(404).json({ msg: 'Precio de venta no encontrado' });
        }

        res.json({ msg: 'Precio de venta actualizado correctamente', precioVenta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el precio de venta' });
    }
};

const precioVentaDelete = async (req, res = response) => {
    const { id } = req.params;

    try {
        const precioVenta = await PrecioVenta.findByIdAndDelete(id);
        if (!precioVenta) {
            return res.status(404).json({ msg: 'Precio de venta no encontrado' });
        }

        res.json({ msg: 'Precio de venta eliminado exitosamente', precioVenta });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el precio de venta' });
    }
};

const precioVentaGetById = async (req, res = response) => {
    const { id } = req.params;

    try {
        const precioVenta = await PrecioVenta.findById(id).populate('unidadMedida').populate('color');
        if (!precioVenta) {
            return res.status(404).json({ msg: 'Precio de venta no encontrado' });
        }

        res.json(precioVenta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener el precio de venta' });
    }
};

const precioVentaActualizarEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    
    try {
        const precioVenta = await PrecioVenta.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );
  
        if (!precioVenta) {
            return res.status(404).json({ mensaje: 'Precio de venta no encontrado.' });
        }
  
        res.json({ estado: precioVenta.estado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado del precio de venta.', error });
    }
};

module.exports = {
    precioVentaGet,
    precioVentaPost,
    precioVentaPut,
    precioVentaDelete,
    precioVentaGetById,
    precioVentaActualizarEstado
};
