const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailUnico = async function (value) {
    if (this.isModified('correo')) {
        const existeUsuario = await Usuario.findOne({ correo: value });
        return !existeUsuario;
    }
    return true;
};

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        validate: {
            validator: EmailUnico,
            message: 'El correo electrónico ya está en uso.'
        }
    },
    telefono: {
        type: String,
        required: true
    },
    codigoAcceso: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Rol'
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
