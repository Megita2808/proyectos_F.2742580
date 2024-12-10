const mongoose = require('mongoose');
const Compra = require('../../modules/compra/compraModule');
const Categoria = require('../../modules/Catalogo/categoria');
const Venta = require('../../modules/venta/ventaModule');
const Envio = require('../../modules/envio/envioModule');

const { Departamento, UsuarioLocacion }= require('../../modules/usuario/direccionModule');
const Usuario = require('../../modules/usuario/usuarioModule');

const VentasPorCategoriaGet = async (req, res) => {
    try {
        const compra = await Compra.find({ estado: true })
        .select('_id fechaCompra subTotal fechaVenta detalleCompra')

        const categorias = await Categoria.find({ estado: true })

        const ventas = await Venta.find({ estado: true, tipoVenta: { $ne: 'enviar' } })
        .select('_id tipoVenta subTotal fechaVenta');

        const envios = await Envio.find()
        .populate({
            path: 'usuario',
            model: 'Usuario',
            select: '_id nombre correo',
        })
        .populate({
            path: 'venta',
            model: 'Venta',
            select: '_id tipoVenta subTotal fechaVenta',
        })

        const enviosConLocacion = await Promise.all(envios.map(async (envio) => {
            if (!envio.venta || !envio.usuario._id) {
                return { ...envio.toObject(), locaciones: null, message: 'Usuario no encontrado en la venta.' };
            }

            const usuarioLocacion = await UsuarioLocacion.findOne({ usuarioId: envio.usuario._id }).select('ciudades');
            if (!usuarioLocacion) {
                return { ...envio.toObject(), locaciones: null, message: 'No se encontró la locación del usuario.' };
            }

            const ciudadIds = usuarioLocacion.ciudades.map(ciudad => ciudad.ciudadId);
            
            const departamentos = await Departamento.find(
                { 'ciudades._id': { $in: ciudadIds } },
                'nombreDepartamento ciudades.$'
            );

            const locaciones = usuarioLocacion.ciudades.map(ciudad => {
                const departamentoInfo = departamentos.find(dept => 
                    dept.ciudades.some(c => c._id.equals(ciudad.ciudadId))
                );

                const nombreCiudad = departamentoInfo 
                    ? departamentoInfo.ciudades.find(c => c._id.equals(ciudad.ciudadId)).nombreCiudad
                    : 'Ciudad desconocida';
                
                const nombreDepartamento = departamentoInfo 
                    ? departamentoInfo.nombreDepartamento
                    : 'Departamento desconocido';

                return {
                    departamento: nombreDepartamento,
                    ciudad: nombreCiudad,
                    locaciones: ciudad.locaciones
                };
            });

            return { ...envio.toObject(), locaciones };
        }));

        const ventasSinEnvio = ventas.filter(venta => {
            return !envios.some(envio => envio.venta && envio.venta.toString() === venta._id.toString());
        });
        
        console.log(ventasSinEnvio)
        
        res.status(200).json({ 
            msg: 'Get de datos dashboard exitoso',
            DatosEnvio: enviosConLocacion,
            DatosVenta: ventasSinEnvio,
            DatosCompra: compra,
            DatosCategoria: categorias,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener el catálogo', error: error.message });
    }
};
module.exports = { 
    VentasPorCategoriaGet,
}