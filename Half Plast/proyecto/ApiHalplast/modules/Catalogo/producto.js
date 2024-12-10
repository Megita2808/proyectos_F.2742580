const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedidaProducto = require('./medidaProducto');

const LimpiarNombreProducto = (nombre) => {
  if (!nombre) return '';
  
  nombre = nombre.replace(/\s+/g, ' ').trim();
  
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
};

const productoSchema = new Schema({
  nombreProducto: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
  },
  estado: { type: Boolean,  default: true },
  imagen: { type: Schema.Types.ObjectId, ref: 'Imagen', default: null },
  medidaProducto: [{ type: Schema.Types.ObjectId, ref: 'MedidaProducto', default: null }],
});

productoSchema.pre('save', function(next) {
  this.nombreProducto = LimpiarNombreProducto(this.nombreProducto);
  next();
});

productoSchema.index({ nombreProducto: 1 }, { unique: true });

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
