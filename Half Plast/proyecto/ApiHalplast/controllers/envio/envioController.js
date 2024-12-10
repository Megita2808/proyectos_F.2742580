const mongoose = require('mongoose');
const { response } = require('express');
const nodemailer = require('nodemailer');

const { Departamento, UsuarioLocacion }= require('../../modules/usuario/direccionModule');
const Usuario = require('../../modules/usuario/usuarioModule');

const Envio = require('../../modules/envio/envioModule');

const enviosGet = async (req, res = response) => {
    try {
        const envios = await Envio.find()
            .populate('venta')
            .populate({
                path: 'usuario',
                model: 'Usuario',
                select: '_id nombre correo',
            });

        const enviosConLocacion = await Promise.all(envios.map(async (envio) => {
            if (!envio.direccion) {
                return { ...envio.toObject(), locaciones: 'Dirección no asignada' };
            }

            const usuarioLocacion = await UsuarioLocacion.findOne({ usuarioId: envio.usuario._id }).select('ciudades');
            if (!usuarioLocacion) {
                return { ...envio.toObject(), locaciones: 'No se encontró la locación del usuario.' };
            }

            const ciudadInfo = usuarioLocacion.ciudades.find(ciudad =>
                ciudad.locaciones.some(loc => loc._id.equals(envio.direccion))
            );

            if (!ciudadInfo) {
                return { ...envio.toObject(), locaciones: 'Locación no encontrada en la configuración del usuario.' };
            }

            const departamento = await Departamento.findOne(
                { 'ciudades._id': ciudadInfo.ciudadId },
                'nombreDepartamento ciudades.$'
            );

            if (!departamento) {
                return { ...envio.toObject(), locaciones: 'Información del departamento no encontrada.' };
            }

            const ciudadNombre = departamento.ciudades[0].nombreCiudad;
            const departamentoNombre = departamento.nombreDepartamento;

            const locacion = ciudadInfo.locaciones.find(loc => loc._id.equals(envio.direccion));
            return {
                ...envio.toObject(),
                locaciones: {
                    departamento: departamentoNombre,
                    ciudad: ciudadNombre,
                    locacion: locacion.locacion,
                    coordenadas: locacion.coordenadas
                }
            };
        }));

        res.json({ envios: enviosConLocacion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los envíos' });
    }
};

const guardarEnvio  = async (totalEnvio, direccionEnvio, venta, usuario) => {
    try {   

        const estadoEnvio = "En preparación";
        const nuevoEnvio = new Envio({ estadoEnvio, totalEnvio, venta, direccion: direccionEnvio, usuario });
        const envio = await nuevoEnvio.save();

        return envio;
    } catch (error) {
        return 'Error al registrar el envío';
    }
};  

const enviosPost = async (req, res) => {
    const { totalEnvio, direccionEnvio, venta } = req.body;

    try {   

        const estadoEnvio = "En preparación";
        const nuevoEnvio = new Envio({ estadoEnvio, totalEnvio, venta, direccion: direccionEnvio });
        await nuevoEnvio.save();

        res.json({ msg: 'Envío registrado correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al registrar el envío' });
    }
};

const enviosPut = async (req, res = response) => {
    const { id_envio } = req.params;
    const { estadoEnvio, totalEnvio, direccionEnvio, correo, fechaEntrega, detalleVenta } = req.body;

    if (!estadoEnvio || !totalEnvio || !direccionEnvio || !correo || !fechaEntrega) {
        return res.status(400).json({ msg: 'Por favor, proporcione los datos completos' });
    }

    try {
        const envio = await Envio.findByIdAndUpdate(
            id_envio,
            { estadoEnvio, totalEnvio, direccionEnvio, correo, fechaEntrega, detalleVenta },
            { new: true }
        );

        if (!envio) {
            return res.status(404).json({ msg: 'Envío no encontrado' });
        }

        res.json({ msg: 'Envío actualizado exitosamente', envio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el envío' });
    }
};

const enviosDelete = async (req, res = response) => {
    const { id_envio } = req.params;
    try {
        const envio = await Envio.findByIdAndDelete(id_envio);
        if (!envio) {
            return res.status(404).json({ msg: 'Envío no encontrado' });
        }
        res.json({ msg: 'Envío eliminado exitosamente', envio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el envío' });
    }
};

const enviosCliente = async (req, res = response) => {
    const { c_correo } = req.params;
    if (!c_correo) {
        return res.status(400).json({ msg: 'El correo es requerido' });
    }

    try {
        const usuarioModelo = await Usuario.findOne({ correo: c_correo }).select('_id');
        if (!usuarioModelo) {
            return res.status(404).json({ msg: 'No se encontró el usuario.' });
        }

        const envios = await Envio.find({ usuario: usuarioModelo._id }).populate('venta');
        if (!envios.length) {
            return res.status(404).json({ msg: 'No se encontraron envíos para el correo proporcionado' });
        }

        const locacionesPorEnvio = await Promise.all(envios.map(async envio => {
            const direccion = envio.direccion;
            if (!direccion) {
                return { envio, locaciones: 'Dirección no asignada' };
            }

            const usuarioLocacion = await UsuarioLocacion.findOne({ usuarioId: usuarioModelo._id }).select('ciudades');
            if (!usuarioLocacion) {
                throw new Error('No se encontró el usuario de locación.');
            }

            const ciudadInfo = usuarioLocacion.ciudades.find(ciudad => 
                ciudad.locaciones.some(loc => loc._id.equals(direccion))
            );

            if (!ciudadInfo) {
                return { envio, locaciones: 'Locación no encontrada en la configuración del usuario' };
            }

            const departamento = await Departamento.findOne({ 'ciudades._id': ciudadInfo.ciudadId }, 'nombreDepartamento ciudades.$');
            if (!departamento) {
                return { envio, locaciones: 'Información del departamento no encontrada' };
            }

            const ciudadNombre = departamento.ciudades[0].nombreCiudad;
            const departamentoNombre = departamento.nombreDepartamento;

            const locacion = ciudadInfo.locaciones.find(loc => loc._id.equals(direccion));
            return {
                envio,
                locaciones: {
                    departamento: departamentoNombre,
                    ciudad: ciudadNombre,
                    locacion: locacion.locacion,
                    coordenadas: locacion.coordenadas
                }
            };
        }));

        res.status(200).json({ locacionesPorEnvio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los envíos' });
    }
};

const EnviosTerminadosCliente = async (req, res = response) => {
    const { c_correo } = req.params;
    if (!c_correo) {
        return res.status(400).json({ msg: 'El correo es requerido' });
    }

    try {
        const envios = await Envio.find({ correo: c_correo, estadoEnvio: "Terminado" });
        if (!envios.length) {
            return res.status(404).json({ msg: 'No se encontraron envíos para el correo proporcionado' });
        }
        res.json({ envios });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los envíos' });
    }
};

const EnviosDetalle = async (req, res = response) => {
    const { id_envio } = req.params;
    if (!id_envio) {
        return res.status(400).json({ msg: 'El id es requerido' });
    }

    try {
        const envio = await Envio.findById(id_envio)
        .populate({
          path: 'venta',
          populate: [
            {
                path: 'detalleVenta.medidasProducto.medida',
                model: 'MedidaProducto',
                select: '_id longitudMedida',
                populate: [
                    {
                       
                        path: 'longitudMedida.unidadMedida',
                        model: 'UnidadMedida',
                        select: '_id nombre simbolo'
                    }
                ]
            },
            {
                path: 'detalleVenta.medidasProducto.color',
                model: 'Color',
                select: 'nombreColor'
            },
            {
                path: 'detalleVenta.medidasVenta.medida',
                model: 'MedidaVenta',
                select: '_id longitudMedida',
                populate: [
                    {
                       
                        path: 'longitudMedida.unidadMedida',
                        model: 'UnidadMedida',
                        select: '_id nombre simbolo'
                    }
                ]
            },
            {
                path: 'detalleVenta.medidasVenta.color',
                model: 'Color',
                select: 'nombreColor'
            },
          ],
        })

        if (!envio) {
            return res.status(404).json({ msg: 'No se encontraron envíos para el id proporcionado' });
        }
        res.json(envio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener los detalles del envío' });
    }
};

module.exports = {
    enviosGet,
    guardarEnvio,
    enviosPost,
    enviosPut,
    enviosDelete,
    enviosCliente,
    EnviosTerminadosCliente,
    EnviosDetalle
};
