import mongoose from "mongoose";

const AdopcionSchema = new mongoose.Schema({
  nombre:{type : String},
  especie: { type: String, enum: ["perro", "gato", "conejo", "pez"] },
  edad: {type:Number},
  sexo: { type: String, enum: ["macho", "hembra"] , required:true},
  descripcion: { type : String},
  estado: { type: String, enum: ["pendiente", "aprobada"], default: "pendiente" },
  fechaSolicitud: { type: Date, default: Date.now },
  fechaRespuesta: { type: Date },
  descripcion: {type:String },
  telefono:{type:Number,required:true},
  correo:{type:String},
  fotosIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "uploads.files"}],
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

export default mongoose.model("Adopcion", AdopcionSchema);
