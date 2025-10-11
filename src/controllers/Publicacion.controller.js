import Publicacion from "../models/Publicacion.js";
import { getGFS } from "../database.js"; // ✅ tu conexión GridFS
import { Readable } from "stream";

// Lista de palabras prohibidas
const palabrasProhibidas = [
  "idiota", "tonto", "estúpido", "imbécil", "pendejo",
  "mierda", "puta", "maldito", "hp"
];

// Censurar texto
const censurarTexto = (texto) => {
  let resultado = texto;
  palabrasProhibidas.forEach((palabra) => {
    const regex = new RegExp(`\\b${palabra}\\b`, "gi");
    resultado = resultado.replace(regex, "****");
  });
  return resultado;
};

// 📸 Crear una publicación con imagen en GridFS
export const crearPublicacion = async (req, res) => {
  try {
    console.log("📥 Campos:", req.body);
    console.log("🖼 Archivos:", req.files);

    if (req.body.contenido) {
      req.body.contenido = censurarTexto(req.body.contenido);
    }

    const gfs = getGFS();
    const imagenIds = [];

    // 🔹 Guardar imágenes en GridFS
    for (const file of req.files) {
      const stream = Readable.from(file.buffer);
      const uploadStream = gfs.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });
      stream.pipe(uploadStream);

      const fileId = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", reject);
      });

      imagenIds.push(fileId.toString());
    }

    // 🔹 Crear publicación con referencias a imágenes
    const publicacion = new Publicacion({
      usuarioId: req.body.usuarioId,
      contenido: req.body.contenido,
      imagenes: imagenIds,
    });

    await publicacion.save();
    res.status(201).json(publicacion);
  } catch (error) {
    console.error("❌ Error al crear publicación:", error);
    res
      .status(400)
      .json({ message: "Error al crear publicación", error: error.message });
  }
};

// 📸 Obtener foto de GridFS por ID
export const obtenerFotoPublicacion = async (req, res) => {
  try {
    const gfs = getGFS();
    const fileId = req.params.id;
    const stream = gfs.openDownloadStream(fileId);
    stream.on("error", () => res.status(404).json({ message: "Imagen no encontrada" }));
    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener imagen", error: error.message });
  }
};

// 📋 Obtener todas las publicaciones
export const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate("usuarioId", "username email")
      .sort({ fecha: -1 });
    res.json(publicaciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener publicaciones", error: error.message });
  }
};

// 📋 Obtener publicación por ID
export const obtenerPublicacionPorId = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id)
      .populate("usuarioId", "username email");

    if (!publicacion) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.json(publicacion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener publicación", error: error.message });
  }
};

// 🗑 Eliminar publicación
export const eliminarPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findByIdAndDelete(req.params.id);
    if (!publicacion)
      return res.status(404).json({ message: "Publicación no encontrada" });

    res.json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar publicación", error: error.message });
  }
};
