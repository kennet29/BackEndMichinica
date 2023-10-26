import mongoose from "mongoose";

const diseñoSchema = new mongoose.Schema(
  {
    
    diseno: {
      type: String,
      required: true,
      trim: true,
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
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Diseno", diseñoSchema);
