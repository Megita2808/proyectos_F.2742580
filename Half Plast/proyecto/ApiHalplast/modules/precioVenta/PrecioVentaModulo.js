const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnidadMedida = require('../unidadMedida/UnidadesMedidaModulo');
const Color = require('../Catalogo/color');

const PrecioVentaSchema = new Schema({
  precioUnitario: { type: String, required: true, trim: true },
  unidadMedida: { type: Schema.Types.ObjectId, ref: 'UnidadMedida', default: null },
  color: { type: Schema.Types.ObjectId, ref: 'Color', default: null },
  estado: { type: Boolean, default: true }
}, {
  timestamps: true
});

const PrecioVenta = mongoose.model('PrecioVenta', PrecioVentaSchema);
module.exports = PrecioVenta;