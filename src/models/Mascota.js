import mongoose from "mongoose";

const MascotaSchema = new mongoose.Schema({ 
  nombre: { type: String, required: true },
  especie: { 
    type: String, 
    enum: ["perro", "gato", "ave", "roedor", "tortuga", "conejo", "otro"], 
    required: true 
  }, 
  tarjetaVeterinaria: { type: Boolean, required: true },
  raza: { type: String }, 
  cumpleaños: { type: Date },  // 📌 Usaremos esto para calcular la edad
  sexo: { 
    type: String, 
    enum: ["macho", "hembra"], 
    required: true 
  }, 
  descripcion: { type: String },

  // 📌 Foto de perfil en GridFS
  fotoPerfilId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "uploads.files",   
    default: null 
  },

  // 📌 Galería de fotos
  fotosIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "uploads.files" 
  }],

  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  fechaRegistro: { type: Date, default: Date.now } 
}); 

// 📌 Virtual para calcular edad exacta
MascotaSchema.virtual("edad").get(function () {
  if (!this.cumpleaños) return null;

  const hoy = new Date();
  let años = hoy.getFullYear() - this.cumpleaños.getFullYear();
  let meses = hoy.getMonth() - this.cumpleaños.getMonth();
  let dias = hoy.getDate() - this.cumpleaños.getDate();

  // Ajustar días negativos
  if (dias < 0) {
    meses -= 1;
    const diasMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    dias += diasMesAnterior;
  }

  // Ajustar meses negativos
  if (meses < 0) {
    años -= 1;
    meses += 12;
  }

  return { años, meses, dias };
});

// 📌 Virtual para devolver un string amigable
MascotaSchema.virtual("edadTexto").get(function () {
  if (!this.cumpleaños) return null;

  const { años, meses, dias } = this.edad;

  let partes = [];
  if (años > 0) partes.push(`${años} año${años > 1 ? "s" : ""}`);
  if (meses > 0) partes.push(`${meses} mes${meses > 1 ? "es" : ""}`);
  if (dias > 0) partes.push(`${dias} día${dias > 1 ? "s" : ""}`);

  return partes.join(", ") || "0 días";
});

// Asegurar que los virtuals aparezcan en JSON y objetos
MascotaSchema.set("toJSON", { virtuals: true });
MascotaSchema.set("toObject", { virtuals: true });

export default mongoose.model("Mascota", MascotaSchema);
