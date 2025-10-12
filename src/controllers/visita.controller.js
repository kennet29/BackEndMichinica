import mongoose from "mongoose";
import Visita from "../models/Visita.js";

// 📌 Crear visita
export const crearVisita = async (req, res) => {
  try {
    const { motivo, fecha, mascotaId, peso, veterinario, notas } = req.body;

    // 🧩 Validaciones
    if (!motivo?.trim() || !fecha || !mascotaId || peso === undefined || peso === null) {
      return res.status(400).json({
        message: "El motivo, la fecha, el peso y la mascotaId son obligatorios",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(mascotaId)) {
      return res.status(400).json({ message: "ID de mascota no válido" });
    }

    if (isNaN(Date.parse(fecha))) {
      return res.status(400).json({ message: "Fecha no válida" });
    }

    if (isNaN(peso)) {
      return res.status(400).json({ message: "Peso no válido (debe ser numérico)" });
    }

    // 🧱 Crear nueva visita con peso incluido
    const visita = new Visita({
      motivo: motivo.trim(),
      fecha,
      mascotaId,
      peso: Number(peso),
      veterinario: veterinario?.trim() || "",
      notas: notas?.trim() || "",
    });

    await visita.save();

    res.status(201).json({ message: "Visita creada con éxito", visita });
  } catch (error) {
    console.error("❌ Error al crear visita:", error);
    res.status(400).json({ message: "Error al crear visita", error: error.message });
  }
};


// 📌 Obtener todas las visitas de una mascota
export const obtenerVisitas = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(mascotaId)) {
      return res.status(400).json({ message: "ID de mascota no válido" });
    }

    const visitas = await Visita.find({ mascotaId });
    res.status(200).json(visitas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener visitas", error: error.message });
  }
};

// 📌 Obtener visita por ID
export const obtenerVisitaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de visita no válido" });
    }

    const visita = await Visita.findById(id);
    if (!visita) return res.status(404).json({ message: "Visita no encontrada" });
    res.status(200).json(visita);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener visita", error: error.message });
  }
};

// 📌 Actualizar visita
export const actualizarVisita = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, fecha } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de visita no válido" });
    }

    if (!motivo?.trim() && !fecha) {
      return res.status(400).json({
        message: "Debes proporcionar al menos un campo para actualizar (motivo o fecha)",
      });
    }

    if (fecha && isNaN(Date.parse(fecha))) {
      return res.status(400).json({ message: "Fecha no válida" });
    }

    const visita = await Visita.findByIdAndUpdate(
      id,
      { ...(motivo ? { motivo: motivo.trim() } : {}), ...(fecha ? { fecha } : {}) },
      { new: true, runValidators: true }
    );

    if (!visita) return res.status(404).json({ message: "Visita no encontrada" });
    res.status(200).json({ message: "Visita actualizada con éxito", visita });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar visita", error: error.message });
  }
};

// 📌 Eliminar visita
export const eliminarVisita = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de visita no válido" });
    }

    const visita = await Visita.findByIdAndDelete(id);
    if (!visita) return res.status(404).json({ message: "Visita no encontrada" });
    res.status(200).json({ message: "Visita eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar visita", error: error.message });
  }
};
