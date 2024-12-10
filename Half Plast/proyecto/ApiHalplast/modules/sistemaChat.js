const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sistemaChatSchema = new Schema({
  cliente: { type: String, required: true },
  empleado: { type: String, default: "null" },
  pqrs: { type: Schema.Types.ObjectId, ref: 'PQRS', required: true },
  fechas: [
    {
      fechaChat: { type: Date, default: Date.now },
      estado: { type: String, required: true },
    }
  ]
});

const SistemaChat = mongoose.model('SistemaChat', sistemaChatSchema);
module.exports = SistemaChat;