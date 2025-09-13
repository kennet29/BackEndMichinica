import mongoose from "mongoose";

const EventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  ubicacion: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  estado:{type:Boolean,required:true},
  fechaFin: { type: Date, required: true },
  organizadorId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }]
});

export default mongoose.model("Evento", EventoSchema);
