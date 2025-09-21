import mongoose from "mongoose";

const DesparasitacionSchema = new mongoose.Schema({
  mascotaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Mascota", 
    required: true 
  },
  tipo: { 
    type: String, 
    enum: ["interna", "externa"], 
    required: true 
  },
  producto: { 
    type: String, 
    required: true,
    trim: true 
  },
  dosis: { 
    type: String, 
    required: true,
    trim: true 
  },
  fecha: { type: Date, required: true },
  proxima: { 
    type: Date,
    validate: {
      validator: function (v) {
        return !v || v > this.fecha; 
      },
      message: "La próxima desparasitación debe ser después de la fecha actual"
    }
  },
  notas: { type: String }
}, { timestamps: true });

export default mongoose.model("Desparasitacion", DesparasitacionSchema);
