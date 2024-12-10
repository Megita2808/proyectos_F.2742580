const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Venta = require('../venta/ventaModule')
const Usuario = require('../usuario/usuarioModule')

const envioSchema = new Schema({
  estadoEnvio: { type: String, required: true },
  totalEnvio: { type: Number, required: true },
  venta: { type: Schema.Types.ObjectId, ref: 'Venta', default: null },
  direccion: { type: Schema.Types.ObjectId, ref: 'Direccion', default: null },
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', default: null },
});

const Envio = mongoose.model('Envio', envioSchema);
module.exports = Envio;