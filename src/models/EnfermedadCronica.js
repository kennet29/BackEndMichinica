// models/EnfermedadCronica.js
import mongoose from "mongoose";

const EnfermedadCronicaSchema = new mongoose.Schema({
  mascotaId: { type: mongoose.Schema.Types.ObjectId, ref: "Mascota", required: true },
  nombre: { type: String, required: true },
  diagnosticadaEn: { type: Date },
  tratamiento: { type: String },
  notas: { type: String }
}, { timestamps: true });

export default mongoose.model("EnfermedadCronica", EnfermedadCronicaSchema);
