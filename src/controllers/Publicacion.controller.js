import Publicacion from "../models/Publicacion.js";
import { getGFS } from "../database.js";
import mongoose from "mongoose";
import { Readable } from "stream";

// ============================
// 📌 Crear nueva publicación
// ============================
export const crearPublicacion = async (req, res) => {
  try {
    console.log("📤 Datos recibidos:", req.body);
    console.log("📸 Archivos recibidos:", req.files);

    const { contenido, usuarioId } = req.body;
    const imagenes = req.files?.map((file) => file.filename) || [];

    if (!usuarioId) {
      return res.status(400).json({ message: "Se requiere usuarioId." });
    }

    const nuevaPublicacion = new Publicacion({
      contenido,
      usuarioId,
      imagenes,
      likes: [],
      comentarios: [],
    });

    await nuevaPublicacion.save();
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    console.error("❌ Error al crear publicación:", error);
    res.status(500).json({ message: "Error al crear la publicación" });
  }
};

// ============================
// 📌 Obtener todas las publicaciones
// ============================
export const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate("usuarioId", "username email")
      .populate("comentarios.usuarioId", "username email")
      .sort({ createdAt: -1 }); // 🔽 Últimas primero
    res.json(publicaciones);
  } catch (error) {
    console.error("❌ Error al obtener publicaciones:", error);
    res.status(500).json({ message: "Error al obtener publicaciones" });
  }
};

// ============================
// 📌 Obtener foto de publicación
// ============================
export const obtenerFotoPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const gfs = getGFS();

    if (!gfs) {
      return res.status(500).json({ message: "GridFS no está inicializado" });
    }

    const file = await gfs.find({ filename: id }).toArray();

    if (!file || file.length === 0) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    const readStream = gfs.openDownloadStreamByName(id);
    readStream.pipe(res);
  } catch (error) {
    console.error("❌ Error al obtener imagen:", error);
    res.status(500).json({ message: "Error al obtener imagen" });
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
      return res
        .status(400)
        .json({ message: "Faltan datos para agregar el comentario." });
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
// ❤️ Alternar Like / Unlike
// ============================
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // ID de la publicación
    const { usuarioId } = req.body; // ID del usuario

    if (!usuarioId) {
      return res.status(400).json({ message: "Falta el ID del usuario." });
    }

    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    // Verificar si ya dio like
    const yaDioLike = publicacion.likes.includes(usuarioId);

    if (yaDioLike) {
      // Si ya dio like, lo quitamos
      publicacion.likes = publicacion.likes.filter(
        (uid) => uid.toString() !== usuarioId
      );
    } else {
      // Si no, lo agregamos
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
    res.status(500).json({ message: "Error interno al manejar el like." });
  }
};

// ============================
// 🗑️ Eliminar publicación (opcional)
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
