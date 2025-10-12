import mongoose from "mongoose";
import Publicacion from "../models/Publicacion.js";
import { getGFS } from "../database.js";
import { Readable } from "stream";

// ============================
// 📌 Crear nueva publicación
// ============================
export const crearPublicacion = async (req, res) => {
  try {
    console.log("📥 BODY RECIBIDO:", req.body);
    console.log("📷 FILES RECIBIDOS:", req.files);

    const { contenido, usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ message: "El usuarioId es obligatorio." });
    }

    const bucket = getGFS();
    if (!bucket) {
      return res.status(500).json({ message: "GridFS no inicializado." });
    }

    const imagenesIds = [];

    // ✅ Subir imágenes al bucket GridFS
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadStream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        const readable = new Readable();
        readable.push(file.buffer);
        readable.push(null);
        readable.pipe(uploadStream);

        await new Promise((resolve, reject) => {
          uploadStream.on("finish", () => {
            imagenesIds.push(uploadStream.id); // Guarda el ObjectId real
            resolve();
          });
          uploadStream.on("error", reject);
        });
      }
    }

    // ✅ Crear publicación
    const nuevaPublicacion = new Publicacion({
      contenido,
      usuarioId,
      imagenes: imagenesIds,
      likes: [],
      comentarios: [],
      fecha: new Date(),
    });

    await nuevaPublicacion.save();

    console.log("✅ Publicación guardada correctamente:", nuevaPublicacion);
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    console.error("❌ Error al crear publicación:", error);
    res.status(500).json({ message: "Error al crear publicación", error: error.message });
  }
};

// ============================
// 📸 Obtener imagen desde GridFS
// ============================
export const obtenerFotoPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de imagen no válido" });
    }

    const bucket = getGFS();
    const _id = new mongoose.Types.ObjectId(id);
    const downloadStream = bucket.openDownloadStream(_id);

    res.set("Content-Type", "image/jpeg");
    downloadStream.on("error", () => res.status(404).json({ message: "Imagen no encontrada" }));
    downloadStream.pipe(res);
  } catch (error) {
    console.error("❌ Error al obtener imagen:", error);
    res.status(500).json({ message: "Error al obtener imagen", error: error.message });
  }
};

// ============================
// 📋 Obtener todas las publicaciones
// ============================
export const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate("usuarioId", "username email")
      .populate("comentarios.usuarioId", "username email")
      .sort({ fecha: -1 });

    res.json(publicaciones);
  } catch (error) {
    console.error("❌ Error al obtener publicaciones:", error);
    res.status(500).json({ message: "Error al obtener publicaciones" });
  }
};

// ============================
// 💬 Agregar comentario
// ============================
export const agregarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario, usuarioId } = req.body;

    if (!comentario || !usuarioId) {
      return res.status(400).json({ message: "Faltan datos." });
    }

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    publicacion.comentarios.push({ comentario, usuarioId });
    await publicacion.save();

    res.json(publicacion);
  } catch (error) {
    console.error("❌ Error al agregar comentario:", error);
    res.status(500).json({ message: "Error al agregar comentario" });
  }
};

// ============================
// ❤️ Like / Unlike
// ============================
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.body;

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    const yaDioLike = publicacion.likes.includes(usuarioId);
    if (yaDioLike) {
      publicacion.likes = publicacion.likes.filter((uid) => uid.toString() !== usuarioId);
    } else {
      publicacion.likes.push(usuarioId);
    }

    await publicacion.save();
    res.json({
      success: true,
      likes: publicacion.likes.length,
      mensaje: yaDioLike ? "Like eliminado" : "Like agregado",
    });
  } catch (error) {
    console.error("❌ Error al alternar like:", error);
    res.status(500).json({ message: "Error al manejar el like." });
  }
};

// ============================
// 🗑️ Eliminar publicación
// ============================
export const eliminarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    await Publicacion.findByIdAndDelete(id);
    res.json({ message: "Publicación eliminada correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar publicación:", error);
    res.status(500).json({ message: "Error al eliminar publicación." });
  }
};
