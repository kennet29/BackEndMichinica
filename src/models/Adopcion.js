import mongoose from "mongoose";

const AdopcionSchema = new mongoose.Schema({
  mascotaId: { type: mongoose.Schema.Types.ObjectId, ref: "Mascota", required: true },
  usuarioSolicitanteId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  usuarioRefugioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  estado: { type: String, enum: ["pendiente", "aprobada", "rechazada"], default: "pendiente" },
  fechaSolicitud: { type: Date, default: Date.now },
  fechaRespuesta: { type: Date }
});

export default mongoose.model("Adopcion", AdopcionSchema);
