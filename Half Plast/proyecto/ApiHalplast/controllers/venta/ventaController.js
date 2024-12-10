const mongoose = require('mongoose');
const Venta = require('../../modules/venta/ventaModule');
const Usuario = require('../../modules/usuario/usuarioModule');
const { guardarDireccion } = require('../../controllers/usuario/direccionesController')
const { guardarEnvio } = require('../envio/envioController')

const { RestaExistenciasMedidaProducto } = require('../catalogo/medidaProducto/MedidaProductoController');

const MedidaVenta = require('../../modules/Catalogo/medidaVenta');
const MedidaProducto = require('../../modules/Catalogo/medidaProducto');

const obtenerTodasLasVentas = async (req, res) => {
    try {
        const ventas = await Venta.find()      
        .populate({
            path: 'usuario',
            model: 'Usuario',
            select: '_id nombre correo',
        });
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas', error });
    }
};

const obtenerVentasPorUsuario = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const ventas = await Venta.find({ usuario: usuarioId }).populate('usuario');
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas del usuario', error });
    }
};

const obtenerVentasPorUsuarioCorreo = async (req, res) => {
    const { correo } = req.params;
    try {
        const usuarioUnico = await Usuario.findOne({ correo });
        const ventas = await Venta.find({ usuario: usuarioUnico._id });
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas del usuario', error });
    }
};

const guardarVenta = async (req, res) => {
    const { fechaEnvio , detalleVenta, direccion, tipoVenta, subTotal} = req.body;

    try {
        let usuario = await Usuario.findOne({ 'correo' : direccion.usuario });
        if (!usuario){
            usuario = await Usuario.findById(direccion.usuario);
        }

        if (!usuario._id){
            res.status(400).json({ message: 'Error el usuario no existe' });
        }

        let identificadorLocacion
        if (tipoVenta == 'enviar'){
            if (mongoose.Types.ObjectId.isValid(direccion.identificadorLocacion)) {
                identificadorLocacion = direccion.identificadorLocacion
            }else {
                identificadorLocacion = await guardarDireccion(direccion);
            }
        }else{
            identificadorLocacion = null;
        }

        for (const medidaProducto of detalleVenta.medidasProducto) {
            const medidaProductoCompleto = await MedidaProducto.findById(medidaProducto.medida);
            if (!medidaProductoCompleto){
                return res.status(404).json({ msg: 'Medida producto no encontrada' });
            }
            await RestaExistenciasMedidaProducto(medidaProductoCompleto._id, medidaProducto.medida, medidaProducto.longitud, medidaProducto.Peso, medidaProducto.precioVenta , medidaProducto.cantidad )
        };
        for (const medidaVenta of detalleVenta.medidasVenta) {
            const medidaVentaCompleta = await MedidaVenta.findById(medidaVenta.medida);
            if (!medidaVentaCompleta){
                return res.status(404).json({ msg: 'Medida producto no encontrada' });
            }
            const medidaProductoCompleto = await MedidaProducto.findOne({ medidaVenta: { $in: [medidaVentaCompleta._id] } });
            await RestaExistenciasMedidaProducto(medidaProductoCompleto._id, medidaVenta.medida , medidaVenta.longitud ,medidaVenta.Peso, medidaVenta.precioVenta, medidaVenta.cantidad )
        }

        const estadoVenta = "En preparación";
        const nuevaVenta = new Venta({
            tipoVenta,
            subTotal,
            usuario: usuario._id,
            fechaVenta: Date.now(),
            fechaEntrega: fechaEnvio,
            detalleVenta,
            estadoVenta,
        });
        const ventaGuardada = await nuevaVenta.save();

        if (tipoVenta == 'enviar' && identificadorLocacion){
            
            let total = subTotal
            if (total > 5000){
                total = total * 0.04;
            }else {
                total = 0
            }

            if (mongoose.Types.ObjectId.isValid(direccion.identificadorLocacion)){
                await guardarEnvio(0, identificadorLocacion, ventaGuardada._id, usuario._id);
            }else{
                await guardarEnvio(0, identificadorLocacion.locacionId, ventaGuardada._id, usuario._id);
            }
        }

        res.status(200).json({ msg: 'venta Gurada existosamente' });
    } catch (error) {
        res.status(401).json({ msg: 'Error al guardar la venta'});
    }
};

const actualizarVenta = async (req, res) => {
    const { id } = req.params;
    try {
        const ventaActualizada = await Venta.findByIdAndUpdate(id, req.body, { new: true });
        if (!ventaActualizada) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.status(200).json(ventaActualizada);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la venta', error });
    }
};

const inhabilitarVenta = async (req, res) => {
    const { id } = req.params;
    try {
        const ventaInhabilitada = await Venta.findByIdAndUpdate(id, { estado: false }, { new: true });
        if (!ventaInhabilitada) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.status(200).json(ventaInhabilitada);
    } catch (error) {
        res.status(400).json({ message: 'Error al inhabilitar la venta', error });
    }
};

const eliminarVenta = async (req, res) => {
    const { id } = req.params;
    try {
        const ventaEliminada = await Venta.findByIdAndDelete(id);
        if (!ventaEliminada) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        res.status(200).json({ message: 'Venta eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la venta', error });
    }
};

module.exports = {
    obtenerTodasLasVentas,
    obtenerVentasPorUsuario,
    guardarVenta,
    actualizarVenta,
    inhabilitarVenta,
    eliminarVenta,
    obtenerVentasPorUsuarioCorreo
};
