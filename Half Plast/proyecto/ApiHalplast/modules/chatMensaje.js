const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatMensajeSchema = new Schema({
  SistemaChat: { type: Schema.Types.ObjectId, ref: 'SistemaChat', required: true },
  mensajeCliente: [
    {
      mensaje: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  mensajeEmpleado: [
    {
      mensaje: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const ChatMensaje = mongoose.model('ChatMensaje', ChatMensajeSchema);
module.exports = ChatMensaje;
