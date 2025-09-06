import MascotaPerdida from "../models/MascotaPerdida.js";

// Crear publicación de mascota perdida
export const crearMascotaPerdida = async (req, res) => {
  try {
    const mascotaPerdida = new MascotaPerdida(req.body);
    await mascotaPerdida.save();
    res.status(201).json({ message: "Publicación creada con éxito", mascotaPerdida });
  } catch (error) {
    res.status(400).json({ message: "Error al crear publicación", error: error.message });
  }
};

// Obtener todas las mascotas perdidas
export const obtenerMascotasPerdidas = async (req, res) => {
  try {
    const mascotas = await MascotaPerdida.find()
      .populate("usuarioId", "username email");
    res.status(200).json(mascotas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error: error.message });
  }
};

// Obtener una publicación por ID
export const obtenerMascotaPerdidaPorId = async (req, res) => {
  try {
    const mascota = await MascotaPerdida.findById(req.params.id)
      .populate("usuarioId", "username email");

    if (!mascota) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.status(200).json(mascota);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicación", error: error.message });
  }
};

// Actualizar publicación
export const actualizarMascotaPerdida = async (req, res) => {
  try {
    const mascota = await MascotaPerdida.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!mascota) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.status(200).json({ message: "Publicación actualizada con éxito", mascota });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar publicación", error: error.message });
  }
};

// Eliminar publicación
export const eliminarMascotaPerdida = async (req, res) => {
  try {
    const mascota = await MascotaPerdida.findByIdAndDelete(req.params.id);

    if (!mascota) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.status(200).json({ message: "Publicación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar publicación", error: error.message });
  }
};
