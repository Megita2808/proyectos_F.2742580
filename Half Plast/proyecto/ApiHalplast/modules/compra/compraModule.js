const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedidaProducto = require('../Catalogo/medidaProducto');
const PrecioVenta = require('../precioVenta/PrecioVentaModulo');
const Proveedor = require('../unidadMedida/UnidadesMedidaModulo');

const compraSchema = new Schema({
  detalleCompra: [
    {
      medidaProducto: { 
        type: Schema.Types.ObjectId, 
        ref: 'MedidaProducto', 
        required: [true, 'El campo medidaProducto es obligatorio'],
        default: null 
      },

      color: { 
        type: Schema.Types.ObjectId, 
        ref: 'PrecioVenta', 
        required: [true, 'El campo color es obligatorio'], 
        default: null 
      },

      cantidad: { 
        type: Number, 
        required: [true, 'El campo cantidad es obligatorio'], 
        min: [1, 'La cantidad mínima es 1'],
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} debe ser un número entero.'
        }
      },

      total: { 
        type: Number, 
        required: [true, 'El campo total es obligatorio'], 
        min: [0, 'El total no puede ser negativo'],
        validate: {
          validator: (v) => Number.isInteger(v) || v % 1 === 0,
          message: '{VALUE} debe ser un número entero o decimal con máximo dos dígitos decimales.'
        }
      },

      proveedor: { 
        type: Schema.Types.ObjectId, 
        ref: 'Proveedor', 
        required: [true, 'El campo proveedor es obligatorio'], 
        default: null 
      },
    }
  ],

  fechaCompra: { 
    type: Date, 
    default: Date.now, 
    required: [true, 'El campo fechaCompra es obligatorio'],
    validate: {
      validator: (date) => date <= Date.now(),
      message: 'La fecha de compra no puede ser futura.'
    }
  },

  estado: { 
    type: Boolean,  
    default: true 
  },
});

const Compra = mongoose.model('Compra', compraSchema);
module.exports = Compra;
