const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Producto = require('./producto');
const Imagen = require('../Img/imagen');

const LimpiarNombreCategoria = (nombre) => {
  if (!nombre) return '';
  
  nombre = nombre.replace(/\s+/g, ' ').trim();
  
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
};

const categoriaSchema = new Schema({
  nombreCategoria: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
  },
  estado: { type: Boolean, default: true },
  imagen: { type: Schema.Types.ObjectId, ref: 'Imagen', default: null },
  producto: [{ type: Schema.Types.ObjectId, ref: 'Producto', default: null }],
});

categoriaSchema.pre('save', function(next) {
  this.nombreCategoria = LimpiarNombreCategoria(this.nombreCategoria);
  next();
});

categoriaSchema.index({ nombreCategoria: 1 }, { unique: true });

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;
