import mongoose from "mongoose";

const EventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  ubicacion: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  estado: { 
    type: String, 
    enum: ["activo", "cancelado", "finalizado"], 
    default: "activo" 
  },
  
  fechaFin: { type: Date, required: true },
  organizadorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Evento", EventoSchema);
