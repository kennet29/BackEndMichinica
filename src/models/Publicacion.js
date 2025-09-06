import mongoose from "mongoose";

const ComentarioSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  comentario: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

const PublicacionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  contenido: { type: String },
  imagenes: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
  comentarios: [ComentarioSchema],
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model("Publicacion", PublicacionSchema);
