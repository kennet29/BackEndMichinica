import mongoose from "mongoose";

const veterinarioSchema = new mongoose.Schema(
  {
    nombres: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    cedulaNumero: { type: String, required: true, unique: true },
    nivel: { type: String, enum: ["Técnico", "Universitario"], required: true },
    codigoIPSA: { type: String, required: true, trim: true, unique: true },
    correo: { type: String, required: true, lowercase: true, unique: true },
    telefono: { type: String, required: true },
    tituloFoto: { type: String }, 
    cedulaFoto: { type: String }, 
    estadoVerificacion: {
      type: String,
      enum: ["Pendiente", "Verificado", "Rechazado"],
      default: "Pendiente",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Veterinario", veterinarioSchema);
