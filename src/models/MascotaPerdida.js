import mongoose from "mongoose";

const MascotaPerdidaSchema = new mongoose.Schema({
  nombre: { type: String }, // si se conoce el nombre
  especie: { 
    type: String, 
    enum: ["perro", "gato", "ave", "roedor", "otro"], 
    required: true 
  },
  raza: { type: String },
  sexo: { type: String, enum: ["macho", "hembra"] },
  descripcion: { type: String }, // características especiales
  fotos: [{ type: String }], // imágenes de la mascota
  fechaPerdida: { type: Date, required: true }, // cuándo se perdió
  lugarPerdida: { type: String, required: true }, // dirección o referencia
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
    ref: "Usuario", 
    required: true 
  },
  fechaPublicacion: { type: Date, default: Date.now }
});

export default mongoose.model("MascotaPerdida", MascotaPerdidaSchema);
