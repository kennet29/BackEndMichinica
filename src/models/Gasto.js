// models/Gasto.js
import mongoose from "mongoose";

const GastoSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    mascotaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mascota",
      required: true,
    },
    tipo: {
      type: String,
      enum: [
        "alimentacion",
        "veterinario",
        "medicamentos",
        "accesorios",
        "higiene",
        "recreacion",
        "transporte",
        "seguros",
        "entrenamiento",
        "guarderia",
        "otros",
      ],
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    monto: {
      type: Number,
      required: true,
      min: 0,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gasto", GastoSchema);
