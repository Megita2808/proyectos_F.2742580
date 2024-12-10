const { response } = require("express");
const PQRS = require('../../modules/pqrs');
const SistemaChat = require('../../modules/sistemaChat');
const Usuario = require('../../modules/usuario/usuarioModule');

const pqrsGet = async (req, res = response) => {
    try {
        const pqrs = await PQRS.find();
        res.json({ pqrs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al obtener PQRS' });
    }
};

const pqrsPost = async (req, res) => {
    const { remitente, pedido, razon, descripcion } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo: remitente });
        if (!usuario) {
            return res.status(400).json({ msg: "Remitente no encontrado" });
        }

        const nuevaPQRS = new PQRS({
            remitente,
            pedido,
            razon,
            descripcion
        });

        const pqrs = await nuevaPQRS.save();
        const estado = "Estado inicial";

        const sistemaChatDocumento = new SistemaChat({
            cliente: remitente,
            empleado: "null",
            pqrs: pqrs._id,
            
            fechas:{
                fechaChat: new Date(),
                estado
            }
        });

        await sistemaChatDocumento.save();

        res.json({ msg: "PQRS registrada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al registrar la PQRS" });
    }
};

const pqrsPut = async (req, res = response) => {
    try {
        const { id_pqrs } = req.params;
        const { remitente, pedido, razon, descripcion } = req.body;

        if (!remitente || !pedido || !razon || !descripcion) {
            return res.status(400).json({ msg: 'Por favor, proporcione los datos completos' });
        }

        const pqrs = await PQRS.findOneAndUpdate({ _id: id_pqrs }, { remitente, pedido, razon, descripcion }, { new: true });

        if (!pqrs) {
            return res.status(404).json({ msg: 'PQRS no encontrado' });
        }

        res.json({ msg: 'PQRS actualizado exitosamente', pqrs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al actualizar PQRS' });
    }
};

const pqrsDelete = async (req, res = response) => {
    try {
        const { id_pqrs } = req.params;
        const pqrs = await PQRS.findOneAndDelete({ _id: id_pqrs });

        if (!pqrs) {
            return res.status(404).json({ msg: 'PQRS no encontrado' });
        }

        res.json({ msg: 'PQRS eliminado exitosamente', pqrs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al eliminar PQRS' });
    }
};

module.exports = {
    pqrsGet,
    pqrsPost,
    pqrsPut,
    pqrsDelete
};