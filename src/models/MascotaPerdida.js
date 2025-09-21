// models/MascotaPerdida.js
import mongoose from "mongoose";

const MascotaPerdidaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    especie: { type: String, required: true },
    raza: { type: String },
    sexo: { type: String },
    descripcion: { type: String, required: true },
    fotos: [
      { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" } 
      // 👆 Aquí guardamos los _id de GridFS
    ],
    fechaPerdida: { type: Date, required: true },
    lugarPerdida: { type: String, required: true },
    contacto: {
      telefono: { type: String },
      email: { type: String },
    },
    estado: { type: String, default: "perdida" },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fechaPublicacion: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("MascotaPerdida", MascotaPerdidaSchema);
