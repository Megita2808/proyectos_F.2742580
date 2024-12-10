const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnidadMedida = require('../unidadMedida/UnidadesMedidaModulo');

const pesoSchema = new Schema({
  peso: { type: Number, required: true },
  unidadMedida: { type: Schema.Types.ObjectId, ref: 'UnidadMedida', default: null },
  estado: { type: Boolean,  default: true }
});

const Peso = mongoose.model('Peso', pesoSchema);
module.exports = Peso;