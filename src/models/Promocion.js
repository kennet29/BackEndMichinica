import mongoose from "mongoose";

const promocionSchema = new mongoose.Schema(
  {
    promocion: {
      type: String,
      required: true,
      trim: true,
    },
    fecha_inicio: {
      type: Date,
      required: true,
    },
    fecha_final: {
      type: Date,
      required: true,
    },
    descuento: {
      type: Number,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default mongoose.model("Promocion", promocionSchema);
