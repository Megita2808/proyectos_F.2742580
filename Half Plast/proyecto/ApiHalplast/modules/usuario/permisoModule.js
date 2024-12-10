const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permisoSchema = new Schema({
    nombrePermiso: {
        type: String,
        required: true
    },
    descripcionPermiso: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

const Permiso = mongoose.model('Permiso', permisoSchema);

module.exports = Permiso;