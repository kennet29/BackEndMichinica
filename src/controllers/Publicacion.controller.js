import Publicacion from "../models/Publicacion.js";


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

// 🔹 Función para censurar insultos
const censurarTexto = (texto) => {
  let resultado = texto;
  palabrasProhibidas.forEach((palabra) => {
    const regex = new RegExp(`\\b${palabra}\\b`, "gi");
    resultado = resultado.replace(regex, "****");
  });
  return resultado;
};

// 📌 Crear una nueva publicación
export const crearPublicacion = async (req, res) => {
  try {
    console.log("📩 Datos recibidos:", req.body); // 👈 Agregado

    if (req.body.contenido) {
      req.body.contenido = censurarTexto(req.body.contenido);
    }

    const publicacion = new Publicacion({
      usuarioId: req.body.usuarioId, // ahora sí existe
      contenido: req.body.contenido,
      imagenes: [], // podrías guardar URLs luego si usas cloudinary o GridFS
    });

    await publicacion.save();
    res.status(201).json(publicacion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear publicación", error: error.message });
  }
};

// 📌 Obtener todas las publicaciones
export const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate("usuarioId", "username email")
      .populate("comentarios.usuarioId", "username email")
      .sort({ fecha: -1 });

    res.json(publicaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error: error.message });
  }
};

// 📌 Obtener una publicación por ID
export const obtenerPublicacionPorId = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id)
      .populate("usuarioId", "username email")
      .populate("comentarios.usuarioId", "username email");

    if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });

    res.json(publicacion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la publicación", error: error.message });
  }
};

// 📌 Eliminar una publicación
export const eliminarPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findByIdAndDelete(req.params.id);
    if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
    res.json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la publicación", error: error.message });
  }
};

// 📌 Dar like / quitar like
export const toggleLike = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id);
    if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });

    const userId = req.body.usuarioId;
    const index = publicacion.likes.indexOf(userId);

    if (index === -1) {
      publicacion.likes.push(userId);
    } else {
      publicacion.likes.splice(index, 1);
    }

    await publicacion.save();
    res.json(publicacion);
  } catch (error) {
    res.status(500).json({ message: "Error al dar/quitar like", error: error.message });
  }
};

// 📌 Agregar un comentario (con censura)
export const agregarComentario = async (req, res) => {
  try {
    const { usuarioId, comentario } = req.body;
    const publicacion = await Publicacion.findById(req.params.id);

    if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });

    // Censurar insultos en el comentario
    const comentarioCensurado = censurarTexto(comentario);

    publicacion.comentarios.push({ usuarioId, comentario: comentarioCensurado });
    await publicacion.save();

    await publicacion.populate("comentarios.usuarioId", "username email");

    res.status(201).json(publicacion);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar comentario", error: error.message });
  }
};

// 📌 Eliminar un comentario
export const eliminarComentario = async (req, res) => {
  try {
    const { id, comentarioId } = req.params;
    const publicacion = await Publicacion.findById(id);

    if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });

    publicacion.comentarios = publicacion.comentarios.filter(
      (c) => c._id.toString() !== comentarioId
    );

    await publicacion.save();
    res.json(publicacion);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar comentario", error: error.message });
  }
};
