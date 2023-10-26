import mongoose from "mongoose";

const tallaSchema = new mongoose.Schema(
  {
   
    talla: {
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

export default mongoose.model("Talla", tallaSchema);
