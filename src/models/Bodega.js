import mongoose from "mongoose";

const bodegaSchema = new mongoose.Schema(
  {
   
    bodega: {
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

export default mongoose.model("Bodega", bodegaSchema);