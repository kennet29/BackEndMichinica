import mongoose from "mongoose";

const AdopcionSchema = new mongoose.Schema({
  publicacionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "PublicacionAdopcion", 
    required: true 
  },
  usuarioSolicitanteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  estado: { 
    type: String, 
    enum: ["pendiente", "aprobada", "rechazada"], 
    default: "pendiente" 
  },
  fechaSolicitud: { type: Date, default: Date.now },
  fechaRespuesta: { type: Date }
});

export default mongoose.model("Adopcion", AdopcionSchema);
