import Publicacion from "../models/Publicacion.js";

// 📌 Crear una nueva publicación
export const crearPublicacion = async (req, res) => {
  try {
    const publicacion = new Publicacion(req.body);
    await publicacion.save();
    res.status(201).json(publicacion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear publicación", error });
  }
};

// 📌 Obtener todas las publicaciones
export const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate("usuarioId", "username email")
      .populate("comentarios.usuarioId", "username email")
      .sort({ fecha: -1 }); // más recientes primero
    res.json(publicaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error });
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
    res.status(500).json({ message: "Error al obtener la publicación", error });
  }
};

// 📌 Eliminar una publicación
export const eliminarPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findByIdAndDelete(req.params.id);
    if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });
    res.json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la publicación", error });
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
      // Si no ha dado like, agregar
      publicacion.likes.push(userId);
    } else {
      // Si ya dio like, quitar
      publicacion.likes.splice(index, 1);
    }

    await publicacion.save();
    res.json(publicacion);
  } catch (error) {
    res.status(500).json({ message: "Error al dar/quitar like", error });
  }
};

// 📌 Agregar un comentario
export const agregarComentario = async (req, res) => {
  try {
    const { usuarioId, comentario } = req.body;
    const publicacion = await Publicacion.findById(req.params.id);
    if (!publicacion) return res.status(404).json({ message: "Publicación no encontrada" });

    publicacion.comentarios.push({ usuarioId, comentario });
    await publicacion.save();

    // Para devolverlo con datos de usuario
    await publicacion.populate("comentarios.usuarioId", "username email");

    res.status(201).json(publicacion);
  } catch (error) {
    res.status(400).json({ message: "Error al agregar comentario", error });
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
    res.status(500).json({ message: "Error al eliminar comentario", error });
  }
};
