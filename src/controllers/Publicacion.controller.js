import mongoose from "mongoose";
import Publicacion from "../models/Publicacion.js";
import { getGFS } from "../database.js";
import { Readable } from "stream";

// 🧠 Lista de palabras prohibidas
const palabrasProhibidas = [
  "idiota",
  "tonto",
  "estúpido",
  "imbécil",
  "pendejo",
  "mierda",
  "puta",
  "maldito",
  "hp",
];

// 🧹 Función para censurar texto
const censurarTexto = (texto) => {
  let resultado = texto;
  palabrasProhibidas.forEach((palabra) => {
    const regex = new RegExp(`\\b${palabra}\\b`, "gi");
    resultado = resultado.replace(regex, "****");
  });
  return resultado;
};

/**
 * =======================================
 * 📸 CREAR PUBLICACIÓN (con imágenes)
 * =======================================
 */
export const crearPublicacion = async (req, res) => {
  try {
    console.log("📥 BODY RECIBIDO:", req.body);
    console.log("📷 FILES RECIBIDOS:", req.files);

    const { usuarioId, contenido } = req.body;

    if (!usuarioId)
      return res.status(400).json({ message: "El usuarioId es obligatorio." });

    const bucket = getGFS();
    const imagenes = [];

    // 📤 Subir imágenes al bucket de GridFS
    if (req.files && req.files.length > 0) {
      for (const [index, file] of req.files.entries()) {
        const uploadStream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        const readable = new Readable();
        readable.push(file.buffer);
        readable.push(null);
        readable.pipe(uploadStream);

        await new Promise((resolve, reject) => {
          uploadStream.on("finish", () => {
            const id = uploadStream.id.toString();
            imagenes.push(id);
            console.log(`✅ Imagen subida [${index + 1}]: ${id}`);
            resolve();
          });
          uploadStream.on("error", reject);
        });
      }
    }

    // 🧹 Censurar texto si aplica
    const textoLimpio = contenido ? censurarTexto(contenido.trim()) : "";

    // 💾 Guardar publicación
    const nuevaPublicacion = new Publicacion({
      usuarioId,
      contenido: textoLimpio,
      imagenes,
      fecha: new Date(),
    });

    await nuevaPublicacion.save();
    console.log("🎉 Publicación guardada:", nuevaPublicacion);

    res.status(201).json({
      message: "✅ Publicación creada correctamente",
      publicacion: nuevaPublicacion,
    });
  } catch (error) {
    console.error("❌ Error al crear publicación:", error);
    res.status(500).json({
      message: "Error al crear publicación",
      error: error.message,
    });
  }
};

/**
 * =======================================
 * 🖼 OBTENER IMAGEN DESDE GRIDFS
 * =======================================
 */
export const obtenerFotoPublicacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID de imagen no válido" });

    const bucket = getGFS();
    const _id = new mongoose.Types.ObjectId(id);
    const downloadStream = bucket.openDownloadStream(_id);

    // Si el archivo no existe
    downloadStream.on("error", (err) => {
      console.error("⚠️ Error al leer imagen:", err.message);
      res.status(404).json({ message: "Imagen no encontrada" });
    });

    res.set("Content-Type", "image/jpeg");
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener imagen", error: error.message });
  }
};

/**
 * =======================================
 * 📋 OBTENER TODAS LAS PUBLICACIONES
 * =======================================
 */
export const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate("usuarioId", "username email")
      .populate("comentarios.usuarioId", "username email")
      .sort({ fecha: -1 });

    res.json(publicaciones);
  } catch (error) {
    console.error("⚠️ Error al obtener publicaciones:", error);
    res.status(500).json({
      message: "Error al obtener publicaciones",
      error: error.message,
    });
  }
};

/**
 * =======================================
 * 🔍 OBTENER PUBLICACIÓN POR ID
 * =======================================
 */
export const obtenerPublicacionPorId = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id)
      .populate("usuarioId", "username email")
      .populate("comentarios.usuarioId", "username email");

    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    res.json(publicacion);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la publicación",
      error: error.message,
    });
  }
};

/**
 * =======================================
 * 💬 AGREGAR COMENTARIO (con censura)
 * =======================================
 */
export const agregarComentario = async (req, res) => {
  try {
    const { usuarioId, comentario } = req.body;
    const publicacion = await Publicacion.findById(req.params.id);

    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    const comentarioCensurado = censurarTexto(comentario);

    publicacion.comentarios.push({
      usuarioId,
      comentario: comentarioCensurado,
      fecha: new Date(),
    });

    await publicacion.save();
    await publicacion.populate("comentarios.usuarioId", "username email");

    res.status(201).json(publicacion);
  } catch (error) {
    res.status(400).json({
      message: "Error al agregar comentario",
      error: error.message,
    });
  }
};

/**
 * =======================================
 * ❤️ DAR / QUITAR LIKE
 * =======================================
 */
export const toggleLike = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const publicacion = await Publicacion.findById(req.params.id);

    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    const index = publicacion.likes.indexOf(usuarioId);

    if (index === -1) publicacion.likes.push(usuarioId);
    else publicacion.likes.splice(index, 1);

    await publicacion.save();

    res.json({
      message: index === -1 ? "👍 Like agregado" : "👎 Like eliminado",
      likes: publicacion.likes.length,
      publicacion,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al dar o quitar like",
      error: error.message,
    });
  }
};

/**
 * =======================================
 * 🗑 ELIMINAR PUBLICACIÓN
 * =======================================
 */
export const eliminarPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findByIdAndDelete(req.params.id);
    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    res.json({ message: "🗑 Publicación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar publicación",
      error: error.message,
    });
  }
};

/**
 * =======================================
 * 🗑 ELIMINAR COMENTARIO
 * =======================================
 */
export const eliminarComentario = async (req, res) => {
  try {
    const { id, comentarioId } = req.params;
    const publicacion = await Publicacion.findById(id);

    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    publicacion.comentarios = publicacion.comentarios.filter(
      (c) => c._id.toString() !== comentarioId
    );

    await publicacion.save();

    res.json({ message: "🗑 Comentario eliminado", publicacion });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar comentario",
      error: error.message,
    });
  }
};
