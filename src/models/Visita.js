import mongoose from "mongoose";

const VisitaSchema = new mongoose.Schema({
  mascotaId: { type: mongoose.Schema.Types.ObjectId, ref: "Mascota", required: true },
  fecha: { type: Date, required: true },
  motivo: { type: String, required: true },
  peso: { type: Number, required: true },

  veterinario: { type: String },
  notas: { type: String }
}, { timestamps: true });

export default mongoose.model("Visita", VisitaSchema);
