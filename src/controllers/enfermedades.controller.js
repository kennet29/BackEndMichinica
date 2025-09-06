import EnfermedadCronica from "../models/EnfermedadCronica.js";

export const crearEnfermedad = async (req, res) => {
  try {
    const enfermedad = new EnfermedadCronica(req.body);
    await enfermedad.save();
    res.status(201).json(enfermedad);
  } catch (error) {
    res.status(400).json({ message: "Error al crear enfermedad", error: error.message });
  }
};

export const obtenerEnfermedades = async (req, res) => {
  try {
    const enfermedades = await EnfermedadCronica.find({ mascotaId: req.params.mascotaId });
    res.status(200).json(enfermedades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener enfermedades", error: error.message });
  }
};

export const obtenerEnfermedadPorId = async (req, res) => {
  try {
    const enfermedad = await EnfermedadCronica.findById(req.params.id);
    if (!enfermedad) return res.status(404).json({ message: "Enfermedad no encontrada" });
    res.status(200).json(enfermedad);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener enfermedad", error: error.message });
  }
};

export const actualizarEnfermedad = async (req, res) => {
  try {
    const enfermedad = await EnfermedadCronica.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enfermedad) return res.status(404).json({ message: "Enfermedad no encontrada" });
    res.status(200).json(enfermedad);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar enfermedad", error: error.message });
  }
};

export const eliminarEnfermedad = async (req, res) => {
  try {
    const enfermedad = await EnfermedadCronica.findByIdAndDelete(req.params.id);
    if (!enfermedad) return res.status(404).json({ message: "Enfermedad no encontrada" });
    res.status(200).json({ message: "Enfermedad eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar enfermedad", error: error.message });
  }
};
