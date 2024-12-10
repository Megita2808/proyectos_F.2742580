const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pqrsSchema = new Schema({
    remitente: {
        type: String,
        required: true
    },
    pedido: {
        type: String,
        required: true
    },
    razon: {
        tipo: {
            type: String,
            required: true
        },
        motivo: {
            type: String,
            required: true
        },
    },
    descripcion: {
        type: String,
        required: true
    }
});

const PQRS = mongoose.model('PQRS', pqrsSchema);

module.exports = PQRS;
