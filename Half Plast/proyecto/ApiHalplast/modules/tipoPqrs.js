const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const motivoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    }
});

const tipoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    motivos: [motivoSchema],
});

const TipoPqrs = mongoose.model('TipoPqrs', tipoSchema);

module.exports = TipoPqrs;
