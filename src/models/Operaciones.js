// models/Operacion.js
import mongoose from "mongoose";

const OperacionSchema = new mongoose.Schema({
  mascotaId: { type: mongoose.Schema.Types.ObjectId, ref: "Mascota", required: true },
  fecha: { type: Date, required: true },
  tipo: { type: String, required: true },
  veterinario: { type: String },
  resultado: { type: String }
}, { timestamps: true });

export default mongoose.model("Operacion", OperacionSchema);
