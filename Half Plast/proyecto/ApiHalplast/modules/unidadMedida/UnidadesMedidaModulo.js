const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnidadMedidaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  simbolo: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['peso', 'longitud', 'unic', 'descripcion'],
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const UnidadMedida = mongoose.model('UnidadMedida', UnidadMedidaSchema);
module.exports = UnidadMedida;