import Desparasitacion from "../models/Desparasitacion.js";
import mongoose from "mongoose";

// 📌 Crear registro de desparasitación
export const crearDesparasitacion = async (req, res) => {
  try {
    const { mascotaId, fecha, producto, dosis } = req.body;

    // Validaciones básicas
    if (!mascotaId || !fecha || !producto || !dosis) {
      return res.status(400).json({ message: "Todos los campos (mascotaId, fecha, producto, dosis) son obligatorios" });
    }

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(mascotaId)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    const desparasitacion = new Desparasitacion(req.body);
    await desparasitacion.save();

    res.status(201).json({ message: "Desparasitación registrada con éxito", desparasitacion });
  } catch (error) {
    res.status(400).json({ message: "Error al registrar desparasitación", error: error.message });
  }
};

// 📌 Obtener todas las desparasitaciones
export const obtenerDesparasitaciones = async (req, res) => {
  try {
    const desparasitaciones = await Desparasitacion.find()
      .populate("mascotaId", "nombre especie raza");

    if (desparasitaciones.length === 0) {
      return res.status(404).json({ message: "No hay registros de desparasitación" });
    }

    res.status(200).json(desparasitaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener desparasitaciones", error: error.message });
  }
};

// 📌 Obtener una desparasitación por ID
export const obtenerDesparasitacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido" });
    }

    const desparasitacion = await Desparasitacion.findById(id)
      .populate("mascotaId", "nombre especie raza");

    if (!desparasitacion) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.status(200).json(desparasitacion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener desparasitación", error: error.message });
  }
};

// 📌 Actualizar desparasitación
export const actualizarDesparasitacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido" });
    }

    const { mascotaId } = req.body;
    if (mascotaId && !mongoose.Types.ObjectId.isValid(mascotaId)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    const desparasitacion = await Desparasitacion.findByIdAndUpdate(id, req.body, { new: true });

    if (!desparasitacion) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.status(200).json({ message: "Desparasitación actualizada con éxito", desparasitacion });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar desparasitación", error: error.message });
  }
};

// 📌 Eliminar desparasitación
export const eliminarDesparasitacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido" });
    }

    const desparasitacion = await Desparasitacion.findByIdAndDelete(id);

    if (!desparasitacion) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.status(200).json({ message: "Desparasitación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar desparasitación", error: error.message });
  }
};
