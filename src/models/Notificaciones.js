import mongoose from "mongoose";

const NotificacionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mascotaId: { type: mongoose.Schema.Types.ObjectId, ref: "Mascota", required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  leida: { type: Boolean, default: false } // false = pendiente, true = vista
}, { timestamps: true });

export default mongoose.model("Notificacion", NotificacionSchema);
