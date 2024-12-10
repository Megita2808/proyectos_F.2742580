const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LimpiarNombreColor = (nombre) => {
  if (!nombre) return '';
  
  nombre = nombre.replace(/\s+/g, ' ').trim();
  
  return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
};

const colorSchema = new Schema({
  nombreColor: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
  },
  estado: { type: Boolean,  default: true }
});

colorSchema.pre('save', function(next) {
  this.nombreColor = LimpiarNombreColor(this.nombreColor);
  next();
});

colorSchema.index({ nombreColor: 1 }, { unique: true });

const Color = mongoose.model('Color', colorSchema);
module.exports = Color;