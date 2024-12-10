const { response } = require("express");
const TipoPqrs = require('../../modules/tipoPqrs');

const tipoPqrsGet = async (req, res = response) => {
    try {
        const tipos = await TipoPqrs.find();
        res.json({ tipos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al obtener tipos de PQRS' });
    }
};

const tipoPqrsPost = async (req, res) => {
    const { nombre, motivos } = req.body;

    const nuevoTipo = new TipoPqrs({
        nombre,
        motivos
    });

    try {
        await nuevoTipo.save();
        res.json({ msg: "Tipo de PQRS registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al registrar el tipo de PQRS" });
    }
};

const tipoPqrsPut = async (req, res = response) => {
    try {
        const { id_tipo } = req.params;
        const { nombre, motivos } = req.body;

        if (!nombre || !motivos) {
            return res.status(400).json({ msg: 'Por favor, proporcione los datos completos' });
        }

        const tipo = await TipoPqrs.findOneAndUpdate({ _id: id_tipo }, { nombre, motivos }, { new: true });

        if (!tipo) {
            return res.status(404).json({ msg: 'Tipo de PQRS no encontrado' });
        }

        res.json({ msg: 'Tipo de PQRS actualizado exitosamente', tipo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al actualizar tipo de PQRS' });
    }
};

const tipoPqrsDelete = async (req, res = response) => {
    try {
        const { id_tipo } = req.params;
        const tipo = await TipoPqrs.findOneAndDelete({ _id: id_tipo });

        if (!tipo) {
            return res.status(404).json({ msg: 'Tipo de PQRS no encontrado' });
        }

        res.json({ msg: 'Tipo de PQRS eliminado exitosamente', tipo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor al eliminar tipo de PQRS' });
    }
};

module.exports = {
    tipoPqrsGet,
    tipoPqrsPost,
    tipoPqrsPut,
    tipoPqrsDelete
};
