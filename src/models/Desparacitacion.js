// models/Desparasitacion.js
import mongoose from "mongoose";

const DesparasitacionSchema = new mongoose.Schema({
  mascotaId: { type: mongoose.Schema.Types.ObjectId, ref: "Mascota", required: true },
  tipo: { type: String, required: true }, // interna o externa
  fecha: { type: Date, required: true },
  proxima: { type: Date }
}, { timestamps: true });

export default mongoose.model("Desparasitacion", DesparasitacionSchema);
