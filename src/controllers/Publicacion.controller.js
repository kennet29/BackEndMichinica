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
 * 📸 Crear publicación con imágenes en GridFS
 */
export const crearPublicacion = async (req, res) => {
  try {
    console.log("📥 Campos recibidos:", req.body);
    console.log("🖼 Archivos recibidos:", req.files);

    const gfs = getGFS();
    const imagenIds = [];

    // 🔹 Censurar texto si es necesario
    if (req.body.contenido) {
      req.body.contenido = censurarTexto(req.body.contenido);
    }

    // 🔹 Subir imágenes a GridFS
    for (const file of req.files) {
      const stream = Readable.from(file.buffer);
      const uploadStream = gfs.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      stream.pipe(uploadStream);

      const fileId = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => resolve(uploadStream.id.toString()));
        uploadStream.on("error", reject);
      });

      imagenIds.push(fileId);
    }

    // 🔹 Crear publicación
    const publicacion = new Publicacion({
      usuarioId: req.body.usuarioId,
      contenido: req.body.contenido,
      imagenes: imagenIds,
      fecha: new Date(),
    });

    await publicacion.save();
    res.status(201).json(publicacion);
  } catch (error) {
    console.error("❌ Error al crear publicación:", error);
    res.status(400).json({
      message: "Error al crear publicación",
      error: error.message,
    });
  }
};

/**
 * 🖼 Obtener imagen de publicación desde GridFS
 */
export const obtenerFotoPublicacion = async (req, res) => {
  try {
    const gfs = getGFS();
    const fileId = req.params.id;
    const stream = gfs.openDownloadStream(fileId);

    stream.on("error", () =>
      res.status(404).json({ message: "Imagen no encontrada" })
    );

    stream.pipe(res);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener imagen",
      error: error.message,
    });
  }
};

/**
 * 📋 Obtener todas las publicaciones
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
 * 🔍 Obtener una publicación por ID
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
 * 🗑 Eliminar publicación
 */
export const eliminarPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findByIdAndDelete(req.params.id);
    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    res.json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar publicación",
      error: error.message,
    });
  }
};

/**
 * ❤️ Dar o quitar like
 */
export const toggleLike = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const publicacion = await Publicacion.findById(req.params.id);

    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    const index = publicacion.likes.indexOf(usuarioId);

    if (index === -1) {
      publicacion.likes.push(usuarioId);
    } else {
      publicacion.likes.splice(index, 1);
    }

    await publicacion.save();
    res.json({ likes: publicacion.likes.length, publicacion });
  } catch (error) {
    res.status(500).json({
      message: "Error al dar o quitar like",
      error: error.message,
    });
  }
};

/**
 * 💬 Agregar comentario con censura
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
 * 🗑 Eliminar comentario
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
    res.json({ message: "Comentario eliminado", publicacion });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar comentario",
      error: error.message,
    });
  }
};
