const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Usuario = require('../usuario/usuarioModule');

const Estados = Object.freeze({
    INHABILITADO: "INHABILITADO",
    HABILITADO: "HABILITADO",
    SOLICITANTE: "SOLICITANTE",
    TRAMITADO: "TRAMITADO",
    ESPERA: "ESPERA"
});

const EmailUnico = async (value) => {
    const existeDistribuidor = await Distribuidor.findOne({ CorreoEmpresa: value });
    return !existeDistribuidor;
};

const distribuidorSchema = new Schema({
    nombreEmpresa: {
        type: String,
        required: true
    },
    CorreoEmpresa: {
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
        required: true,
        match: /^[0-9]{10}$/
    },
    Usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', 
        default: null 
    },
    estado: { 
        type: String, 
        enum: Object.values(Estados),
        default: Estados.INHABILITADO
    }
}, { timestamps: true });

Object.assign(distribuidorSchema.statics, { Estados });

const Distribuidor = mongoose.model('Distribuidor', distribuidorSchema);

module.exports = Distribuidor;
