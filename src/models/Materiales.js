import mongoose from "mongoose";

const materialesSchema = new mongoose.Schema(
  {
   
    material: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
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

export default mongoose.model("Material", materialesSchema);
