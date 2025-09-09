import EnfermedadCronica from "../models/EnfermedadCronica.js";
import mongoose from "mongoose";

// 📌 Crear enfermedad crónica
export const crearEnfermedad = async (req, res) => {
  try {
    const { mascotaId, nombre, diagnostico, fechaDiagnostico } = req.body;

    // Validaciones de campos obligatorios
    if (!mascotaId || !nombre || !diagnostico || !fechaDiagnostico) {
      return res.status(400).json({
        message: "Todos los campos (mascotaId, nombre, diagnostico, fechaDiagnostico) son obligatorios",
      });
    }

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(mascotaId)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    const enfermedad = new EnfermedadCronica(req.body);
    await enfermedad.save();

    res.status(201).json(enfermedad);
  } catch (error) {
    res.status(400).json({ message: "Error al crear enfermedad", error: error.message });
  }
};

// 📌 Obtener todas las enfermedades crónicas de una mascota
export const obtenerEnfermedades = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(mascotaId)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    const enfermedades = await EnfermedadCronica.find({ mascotaId });

    if (enfermedades.length === 0) {
      return res.status(404).json({ message: "No se encontraron enfermedades para esta mascota" });
    }

    res.status(200).json(enfermedades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener enfermedades", error: error.message });
  }
};

// 📌 Obtener enfermedad por ID
export const obtenerEnfermedadPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido" });
    }

    const enfermedad = await EnfermedadCronica.findById(id);
    if (!enfermedad) {
      return res.status(404).json({ message: "Enfermedad no encontrada" });
    }

    res.status(200).json(enfermedad);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener enfermedad", error: error.message });
  }
};

// 📌 Actualizar enfermedad
export const actualizarEnfermedad = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido" });
    }

    const { mascotaId } = req.body;
    if (mascotaId && !mongoose.Types.ObjectId.isValid(mascotaId)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    const enfermedad = await EnfermedadCronica.findByIdAndUpdate(id, req.body, { new: true });

    if (!enfermedad) {
      return res.status(404).json({ message: "Enfermedad no encontrada" });
    }

    res.status(200).json(enfermedad);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar enfermedad", error: error.message });
  }
};

// 📌 Eliminar enfermedad
export const eliminarEnfermedad = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido" });
    }

    const enfermedad = await EnfermedadCronica.findByIdAndDelete(id);

    if (!enfermedad) {
      return res.status(404).json({ message: "Enfermedad no encontrada" });
    }

    res.status(200).json({ message: "Enfermedad eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar enfermedad", error: error.message });
  }
};
