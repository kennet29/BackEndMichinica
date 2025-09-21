import mongoose from "mongoose";
import EnfermedadCronica from "../models/EnfermedadCronica.js";


export const crearEnfermedadCronica = async (req, res) => {
  try {
    const { mascotaId, nombre } = req.body;

    if (!mascotaId || !nombre) {
      return res.status(400).json({
        message: "El mascotaId y el nombre son obligatorios",
      });
    }

    const enfermedad = new EnfermedadCronica(req.body);
    await enfermedad.save();

    res.status(201).json({ message: "Enfermedad crónica creada con éxito", enfermedad });
  } catch (error) {
    res.status(400).json({ message: "Error al crear enfermedad crónica", error: error.message });
  }
};

export const obtenerEnfermedadesPorMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    if (!mascotaId) {
      return res.status(400).json({ message: "Se requiere el ID de la mascota" });
    }

    const enfermedades = await EnfermedadCronica.find({ mascotaId }).sort({ diagnosticadaEn: -1 });

    if (enfermedades.length === 0) {
      return res.status(404).json({ message: "No se encontraron enfermedades crónicas para esta mascota" });
    }

    res.status(200).json(enfermedades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener enfermedades", error: error.message });
  }
};

export const obtenerEnfermedadPorId = async (req, res) => {
  try {
    const enfermedad = await EnfermedadCronica.findById(req.params.id);

    if (!enfermedad) {
      return res.status(404).json({ message: "Enfermedad crónica no encontrada" });
    }

    res.status(200).json(enfermedad);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener enfermedad crónica", error: error.message });
  }
};

export const actualizarEnfermedadCronica = async (req, res) => {
  try {
    const enfermedad = await EnfermedadCronica.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!enfermedad) {
      return res.status(404).json({ message: "Enfermedad crónica no encontrada" });
    }

    res.status(200).json({ message: "Enfermedad crónica actualizada con éxito", enfermedad });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar enfermedad crónica", error: error.message });
  }
};

export const eliminarEnfermedadCronica = async (req, res) => {
  try {
    const enfermedad = await EnfermedadCronica.findByIdAndDelete(req.params.id);

    if (!enfermedad) {
      return res.status(404).json({ message: "Enfermedad crónica no encontrada" });
    }

    res.status(200).json({ message: "Enfermedad crónica eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar enfermedad crónica", error: error.message });
  }
};