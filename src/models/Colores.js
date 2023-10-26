import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
   
    color: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: Boolean,
      required: true,
    },
    descripcion: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Color", colorSchema);
