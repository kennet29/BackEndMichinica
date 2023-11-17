import mongoose from "mongoose";


const marcaSchema = new mongoose.Schema(
  {
   
    marca: {
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

export default mongoose.model("Marca", marcaSchema);
