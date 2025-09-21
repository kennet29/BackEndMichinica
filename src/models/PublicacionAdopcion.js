import mongoose from "mongoose";

const PublicacionAdopcionSchema = new mongoose.Schema({
  mascotaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Mascota", 
    required: false // 👈 Puede ser null si no está registrada
  },
  datosMascota: { // 👈 en caso de no estar en Mascotas
    nombre: String,
    especie: { type: String, enum: ["perro", "gato", "ave", "roedor", "tortuga", "conejo", "otro"] },
    edad: Number,
    sexo: { type: String, enum: ["macho", "hembra"] },
    descripcion: String,
    fotos: [String]
  },
  usuarioRefugioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  estado: { 
    type: String, 
    enum: ["disponible", "adoptado", "cancelado"], 
    default: "disponible" 
  },
  fechaPublicacion: { type: Date, default: Date.now }
});

export default mongoose.model("PublicacionAdopcion", PublicacionAdopcionSchema);
