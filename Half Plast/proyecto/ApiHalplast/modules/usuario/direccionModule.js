const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ciudadSchema = new Schema({
    nombreCiudad: { type: String, required: true }
});

const departamentoSchema = new Schema({
    nombreDepartamento: { type: String, required: true },
    ciudades: [ciudadSchema]
});

const locacionSchema = new Schema({
    coordenadas: {
        latitud: { type: Number, required: true },
        longitud: { type: Number, required: true },
    },
    locacion: { type: String, required: true },
    estado: { type: Boolean, default: true }
});

const usuarioCiudadSchema = new Schema({
    ciudadId: { type: Schema.Types.ObjectId, ref: 'Ciudad', required: true },
    locaciones: [locacionSchema]
});

const usuarioLocacionSchema = new Schema({
    usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    proveedorId: { type: Schema.Types.ObjectId, ref: 'Proveedor' },
    ciudades: [usuarioCiudadSchema]
});

usuarioLocacionSchema.pre('validate', function (next) {
    if ((this.usuarioId && this.proveedorId) || (!this.usuarioId && !this.proveedorId)) {
        next(new Error('Debe proporcionar un identificador de usuario o un identificador de proveedor, pero no ambos.'));
    } else {
        next();
    }
});

const Departamento = mongoose.model('Departamento', departamentoSchema);
const UsuarioLocacion = mongoose.model('UsuarioLocacion', usuarioLocacionSchema);

module.exports = { Departamento, UsuarioLocacion };
