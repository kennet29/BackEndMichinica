import mongoose from "mongoose";

const MensajeSchema = new mongoose.Schema({
  remitenteId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  destinatarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false }
});

export default mongoose.model("Mensaje", MensajeSchema);
