import mongoose from "mongoose";

const PublicacionSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contenido: { type: String, trim: true },
  imagenes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uploads.files", // 👈 apunta al bucket GridFS
    },
  ],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comentarios: [
    {
      usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comentario: String,
      fecha: { type: Date, default: Date.now },
    },
  ],
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Publicacion", PublicacionSchema);
