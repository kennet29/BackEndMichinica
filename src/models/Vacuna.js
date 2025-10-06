import mongoose from "mongoose";

const VacunaSchema = new mongoose.Schema(
  {
    mascotaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mascota",
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    proximaDosis: {
      type: Date,
    },
    observaciones: {
      type: String, // 👈 NUEVO CAMPO
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vacuna", VacunaSchema);
