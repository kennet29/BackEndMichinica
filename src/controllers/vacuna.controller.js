import Vacuna from "../models/Vacuna.js";

export const crearVacuna = async (req, res) => {
  try {
    const vacuna = new Vacuna(req.body);
    await vacuna.save();
    res.status(201).json(vacuna);
  } catch (error) {
    res.status(400).json({ message: "Error al crear vacuna", error: error.message });
  }
};

export const obtenerVacunas = async (req, res) => {
  try {
    const vacunas = await Vacuna.find({ mascotaId: req.params.mascotaId });
    res.status(200).json(vacunas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vacunas", error: error.message });
  }
};

export const obtenerVacunaPorId = async (req, res) => {
  try {
    const vacuna = await Vacuna.findById(req.params.id);
    if (!vacuna) return res.status(404).json({ message: "Vacuna no encontrada" });
    res.status(200).json(vacuna);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vacuna", error: error.message });
  }
};

export const actualizarVacuna = async (req, res) => {
  try {
    const vacuna = await Vacuna.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vacuna) return res.status(404).json({ message: "Vacuna no encontrada" });
    res.status(200).json(vacuna);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar vacuna", error: error.message });
  }
};

export const eliminarVacuna = async (req, res) => {
  try {
    const vacuna = await Vacuna.findByIdAndDelete(req.params.id);
    if (!vacuna) return res.status(404).json({ message: "Vacuna no encontrada" });
    res.status(200).json({ message: "Vacuna eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar vacuna", error: error.message });
  }
};
