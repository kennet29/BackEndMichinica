import mongoose from "mongoose";

const MascotaSchema = new mongoose.Schema({ 
  nombre: { type: String, required: true },
  especie: { 
    type: String, 
    enum: ["perro", "gato", "ave", "roedor", "otro"], 
    required: true 
  }, 
  tarjetaVeterinaria:{type: Boolean,required:true},
  raza: { type: String }, // raza de la mascota
  edad: { type: Number }, // opcional, puedes calcularla con el cumpleaños
  cumpleaños: { type: Date }, // nuevo campo para fecha de nacimiento
  sexo: { 
    type: String, 
    enum: ["macho", "hembra"], 
    required: true 
  }, 
  descripcion: { type: String },
  fotos: [{ type: String }], 
  estadoAdopcion: { 
    type: String, 
    enum: ["disponible", "adoptado", "en proceso"], 
    default: "disponible" 
  }, 
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
    required: true 
  },
  fechaRegistro: { type: Date, default: Date.now } 
}); 

export default mongoose.model("Mascota", MascotaSchema);