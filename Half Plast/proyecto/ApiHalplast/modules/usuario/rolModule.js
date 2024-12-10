const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rolSchema = new Schema({
    nombreRol: {
        type: String,
        required: true
    },
    permisos: [{
        type: Schema.Types.ObjectId,
        ref: 'Permiso'
    }],
    extraPorcentaje: {
        type: Number,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

const Rol = mongoose.model('Rol', rolSchema);

module.exports = Rol;