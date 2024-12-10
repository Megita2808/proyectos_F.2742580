  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const ventaSchema = new Schema({
    tipoVenta: { type: String, required: true },
    subTotal: { type: Number, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', default: null },
    fechaVenta: { type: Date, default: Date.now, required: true },
    fechaEntrega: { type: Date, required: true },
    detalleVenta: {
      medidasProducto: [
        {
          medida: { type: Schema.Types.ObjectId, ref: 'MedidaProducto', required: true },
          longitud: {
            type: Schema.Types.Mixed,
            validate: {
              validator: function(value) {
                if (typeof value === 'number') return true;
                if (typeof value === 'object' && value.ancho && value.largo) {
                  return typeof value.ancho === 'number' && typeof value.largo === 'number';
                }
                return false;
              },
              message: 'La longitud debe ser un número o un objeto con ancho y largo numéricos.'
            }
          },
          peso: {
            type: Schema.Types.Mixed,
            validate: {
              validator: function (value) {
                if (value === null) return true;
                if (mongoose.Types.ObjectId.isValid(value)) return true;
                if (
                  typeof value === 'object' &&
                  typeof value.valor === 'number' &&
                  mongoose.Types.ObjectId.isValid(value.unidad)
                ) {
                  return true;
                }
                return false;
              },
              message:
                'El campo Peso debe ser un identificador, un objeto con valor y unidad válida, o null.',
            },
            default: null,
          },
          color: { type: Schema.Types.ObjectId, ref: 'Color', required: true },
          cantidad: { type: Number, required: true },
          total: { type: Number, required: true },
        }
      ],
      medidasVenta: [
        {
          medida: { type: Schema.Types.ObjectId, ref: 'MedidaVenta', required: true },
          longitud: {
            type: Schema.Types.Mixed,
            validate: {
              validator: function(value) {
                if (typeof value === 'number') return true;
                if (typeof value === 'object' && value.ancho && value.largo) {
                  return typeof value.ancho === 'number' && typeof value.largo === 'number';
                }
                return false;
              },
              message: 'La longitud debe ser un número o un objeto con ancho y largo numéricos.'
            }
          },
          peso: {
            type: Schema.Types.Mixed,
            validate: {
              validator: function(value) {
                if (value === null) {
                  return true;
                }
                if (mongoose.Types.ObjectId.isValid(value)) {
                  return true;
                }
                if (typeof value === 'object') {
                  if (value.valor === 0 && value.unidad === "") {
                    return true;
                  }
                  return typeof value.valor === 'number' && typeof value.unidad === 'string';
                }
                return false;
              },
              message: 'El campo Peso debe ser una referencia a un esquema, un objeto con valor y unidad, o null.'
            },
            default: null,
          },
          color: { type: Schema.Types.ObjectId, ref: 'Color', required: true },
          cantidad: { type: Number, required: true },
          total: { type: Number, required: true },
        }
      ],
    },
    estadoVenta: { type: String, required: true },
    estado: { type: Boolean,  default: true },
  });

  const Venta = mongoose.model('Venta', ventaSchema);
  module.exports = Venta;
