import mongoose from "mongoose";

const MascotaPerdidaSchema = new mongoose.Schema({
  nombre: { type: String }, 
  especie: { 
    type: String, 
    enum: ["perro", "gato", "ave", "roedor", "otro"], 
    required: true 
  },
  raza: { type: String },
  sexo: { type: String, enum: ["macho", "hembra"] },
  descripcion: { type: String },
  
  // En lugar de URLs, guardamos los IDs de los archivos en GridFS
  fotos: [
    { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" } 
    // uploads.files es la colección que crea GridFS
  ],

  fechaPerdida: { type: Date, required: true },
  lugarPerdida: { type: String, required: true },
  contacto: {
    telefono: { type: String, required: true },
    email: { type: String }
  },
  estado: { 
    type: String, 
    enum: ["perdida", "encontrada"], 
    default: "perdida" 
  },
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  fechaPublicacion: { type: Date, default: Date.now }
});

export default mongoose.model("MascotaPerdida", MascotaPerdidaSchema);
