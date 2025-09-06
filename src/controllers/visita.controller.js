import Visita from "../models/Visita.js";

// Crear visita
export const crearVisita = async (req, res) => {
  try {
    const visita = new Visita(req.body);
    await visita.save();
    res.status(201).json(visita);
  } catch (error) {
    res.status(400).json({ message: "Error al crear visita", error: error.message });
  }
};

// Obtener todas las visitas de una mascota
export const obtenerVisitas = async (req, res) => {
  try {
    const visitas = await Visita.find({ mascotaId: req.params.mascotaId });
    res.status(200).json(visitas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener visitas", error: error.message });
  }
};

// Obtener visita por ID
export const obtenerVisitaPorId = async (req, res) => {
  try {
    const visita = await Visita.findById(req.params.id);
    if (!visita) return res.status(404).json({ message: "Visita no encontrada" });
    res.status(200).json(visita);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener visita", error: error.message });
  }
};

// Actualizar visita
export const actualizarVisita = async (req, res) => {
  try {
    const visita = await Visita.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!visita) return res.status(404).json({ message: "Visita no encontrada" });
    res.status(200).json(visita);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar visita", error: error.message });
  }
};

// Eliminar visita
export const eliminarVisita = async (req, res) => {
  try {
    const visita = await Visita.findByIdAndDelete(req.params.id);
    if (!visita) return res.status(404).json({ message: "Visita no encontrada" });
    res.status(200).json({ message: "Visita eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar visita", error: error.message });
  }
};
