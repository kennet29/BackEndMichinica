import mongoose from "mongoose";

const AdopcionSchema = new mongoose.Schema({
  nombre:{type:string},
  especie: { type: String, enum: ["perro", "gato", "conejo", "pez"] },
  edad: {type:Number},
  sexo: { type: String, enum: ["macho", "hembra"] , required:true},
  descripcion: String,
  estado: { type: String, enum: ["pendiente", "aprobada"], default: "pendiente" },
  fechaSolicitud: { type: Date, default: Date.now },
  fechaRespuesta: { type: Date },
  descripcion: {type:string },
  telefono:{type:number,required:true},
  correo:{type:string},
  fotosIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "uploads.files"}],
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

export default mongoose.model("Adopcion", AdopcionSchema);
