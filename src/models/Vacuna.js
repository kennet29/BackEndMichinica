import mongoose from "mongoose";

const VacunaSchema = new mongoose.Schema({
  mascotaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Mascota", 
    required: true 
  },
  nombre: { 
    type: String, 
    required: true 
  },
  fecha: { 
    type: Date, 
    required: true 
  },
  proximaDosis: { 
    type: Date 
  }
}, { timestamps: true });

export default mongoose.model("Vacuna", VacunaSchema);
