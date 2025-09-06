import Desparasitacion from "../models/Desparasitacion.js";

export const crearDesparasitacion = async (req, res) => {
  try {
    const desparasitacion = new Desparasitacion(req.body);
    await desparasitacion.save();
    res.status(201).json(desparasitacion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear desparasitación", error: error.message });
  }
};

export const obtenerDesparasitaciones = async (req, res) => {
  try {
    const desparasitaciones = await Desparasitacion.find({ mascotaId: req.params.mascotaId });
    res.status(200).json(desparasitaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener desparasitaciones", error: error.message });
  }
};

export const obtenerDesparasitacionPorId = async (req, res) => {
  try {
    const desparasitacion = await Desparasitacion.findById(req.params.id);
    if (!desparasitacion) return res.status(404).json({ message: "Desparasitación no encontrada" });
    res.status(200).json(desparasitacion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener desparasitación", error: error.message });
  }
};

export const actualizarDesparasitacion = async (req, res) => {
  try {
    const desparasitacion = await Desparasitacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!desparasitacion) return res.status(404).json({ message: "Desparasitación no encontrada" });
    res.status(200).json(desparasitacion);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar desparasitación", error: error.message });
  }
};

export const eliminarDesparasitacion = async (req, res) => {
  try {
    const desparasitacion = await Desparasitacion.findByIdAndDelete(req.params.id);
    if (!desparasitacion) return res.status(404).json({ message: "Desparasitación no encontrada" });
    res.status(200).json({ message: "Desparasitación eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar desparasitación", error: error.message });
  }
};
