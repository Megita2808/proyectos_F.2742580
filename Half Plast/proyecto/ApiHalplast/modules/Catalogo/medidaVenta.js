const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medidaVentasSchema = new Schema({
  longitudMedida: {
    valor: { type: Number, required: true, min: 0 },
    unidadMedida: { type: Schema.Types.ObjectId, ref: 'UnidadMedida', default: null }
  },
  peso: {
    valores: [
      {
        valor: { 
          type: Schema.Types.ObjectId, 
          ref: 'Peso', 
          default: null 
        }
      }
    ],
    unidadMedida: { 
      type: Schema.Types.ObjectId, 
      ref: 'UnidadMedida', 
      default: null 
    }
  },
  estado: { type: Boolean,  default: true },
  colores: [
    {
      PrecioVenta: { type: Schema.Types.ObjectId, ref: 'PrecioVenta', default: null },
      imagen: { type: Schema.Types.ObjectId, ref: 'Imagen', default: null },
    }
  ]
});

const MedidaVenta = mongoose.model('MedidaVenta', medidaVentasSchema);
module.exports = MedidaVenta;