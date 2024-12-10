const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedidaVenta = require('./medidaVenta');
const PrecioVenta = require('../precioVenta/PrecioVentaModulo');
const UnidadMedida = require('../unidadMedida/UnidadesMedidaModulo');
const Peso = require('./peso');

const medidaProductoSchema = new Schema({
  longitudMedida: {
    valor: { type: Number, required: true, min: 0 },
    unidadMedida: { type: Schema.Types.ObjectId, ref: 'UnidadMedida', default: null },
    longitudExacta: {
      ancho: {
        valor: { type: Number, required: true, min: 0, default: 0 },
        unidadMedida: { type: Schema.Types.ObjectId, ref: 'UnidadMedida', default: null }
      },
      largo: {
        valor: { type: Number, required: true, min: 0, default: 0 },
        unidadMedida: { type: Schema.Types.ObjectId, ref: 'UnidadMedida', default: null }
      }
    }
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

  colores: [
    {
      PrecioVenta: { type: Schema.Types.ObjectId, ref: 'PrecioVenta', default: null },
      existencias: {
        cantidad: { type: Number, default: 0 },
        equivalencia: {  
          unidadMedida: { 
            type: Schema.Types.ObjectId, 
            ref: 'UnidadMedida', 
            default: null 
          },
          valor: { 
            type: Number
          },
        },
      },
    }
  ],
  
  estado: { type: Boolean,  default: true },
  medidaVenta: [{ type: Schema.Types.ObjectId, ref: 'MedidaVenta', default: null }]
});

const MedidaProducto = mongoose.model('MedidaProducto', medidaProductoSchema);
module.exports = MedidaProducto;
