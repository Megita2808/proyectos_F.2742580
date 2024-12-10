const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const estadoDescripcionSchema = new Schema({
  idEnvio: { type: Schema.Types.ObjectId, ref: 'Envio', default: null },
  idVenta: { type: Schema.Types.ObjectId, ref: 'Venta', default: null },
  EstadoEnvio: [
    {
      motivo: { type: String, required: true },
      descripcion: { type: String, default: 'Sin descripcion' },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

estadoDescripcionSchema.pre('validate', function (next) {
  if ((this.idEnvio && this.idVenta) || (!this.idEnvio && !this.idVenta)) {
    return next(new Error('Debe especificar solo uno: idEnvio o idVenta.'));
  }
  next();
});

const EstadoDescripcion = mongoose.model('EstadoDescripcion', estadoDescripcionSchema);
module.exports = EstadoDescripcion;
