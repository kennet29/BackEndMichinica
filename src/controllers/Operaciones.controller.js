import Operacion from "../models/Operacion.js";

export const crearOperacion = async (req, res) => {
  try {
    const operacion = new Operacion(req.body);
    await operacion.save();
    res.status(201).json(operacion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear operación", error: error.message });
  }
};

export const obtenerOperaciones = async (req, res) => {
  try {
    const operaciones = await Operacion.find({ mascotaId: req.params.mascotaId });
    res.status(200).json(operaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener operaciones", error: error.message });
  }
};

export const obtenerOperacionPorId = async (req, res) => {
  try {
    const operacion = await Operacion.findById(req.params.id);
    if (!operacion) return res.status(404).json({ message: "Operación no encontrada" });
    res.status(200).json(operacion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener operación", error: error.message });
  }
};

export const actualizarOperacion = async (req, res) => {
  try {
    const operacion = await Operacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!operacion) return res.status(404).json({ message: "Operación no encontrada" });
    res.status(200).json(operacion);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar operación", error: error.message });
  }
};

export const eliminarOperacion = async (req, res) => {
  try {
    const operacion = await Operacion.findByIdAndDelete(req.params.id);
    if (!operacion) return res.status(404).json({ message: "Operación no encontrada" });
    res.status(200).json({ message: "Operación eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar operación", error: error.message });
  }
};
