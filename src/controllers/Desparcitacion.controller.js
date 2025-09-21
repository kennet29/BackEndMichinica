import Desparasitacion from "../models/Desparacitacion.js";
import mongoose from "mongoose";


export const crearDesparasitacion = async (req, res) => {
  try {
    const { mascotaId, fecha, producto, dosis, tipo, proxima, notas } = req.body;


    if (!mascotaId || !fecha || !producto || !dosis || !tipo) {
      return res.status(400).json({ 
        message: "Los campos (mascotaId, fecha, producto, dosis, tipo) son obligatorios" 
      });
    }

    if (!mongoose.isValidObjectId(mascotaId)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    const desparasitacion = new Desparasitacion({
      mascotaId,
      fecha,
      producto,
      dosis,
      tipo,
      proxima,
      notas
    });

    await desparasitacion.save();

    res.status(201).json({ 
      message: "Desparasitación registrada con éxito", 
      desparasitacion 
    });
  } catch (error) {
    res.status(400).json({ 
      message: "Error al registrar desparasitación", 
      error: error.message 
    });
  }
};

export const obtenerDesparasitaciones = async (req, res) => {
  try {
    const desparasitaciones = await Desparasitacion.find()
      .populate("mascotaId", "nombre especie raza");

    if (desparasitaciones.length === 0) {
      return res.status(404).json({ message: "No hay registros de desparasitación" });
    }

    res.status(200).json(desparasitaciones);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener desparasitaciones", 
      error: error.message 
    });
  }
};

export const obtenerDesparasitacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido" });
    }

    const desparasitacion = await Desparasitacion.findById(id)
      .populate("mascotaId", "nombre especie raza");

    if (!desparasitacion) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.status(200).json(desparasitacion);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener desparasitación", 
      error: error.message 
    });
  }
};

export const obtenerDesparasitacionesPorMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    if (!mongoose.isValidObjectId(mascotaId)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    let desparasitaciones = await Desparasitacion.find({ mascotaId })
      .populate("mascotaId", "nombre especie raza");

    if (!desparasitaciones || desparasitaciones.length === 0) {
      return res.status(404).json({ message: "No hay desparasitaciones para esta mascota" });
    }

    const hoy = new Date();
    desparasitaciones = desparasitaciones.map(d => {
      let diasRestantes = null;
      let estado = "sin próxima fecha";

      if (d.proxima) {
        const diff = Math.ceil((new Date(d.proxima) - hoy) / (1000 * 60 * 60 * 24));
        diasRestantes = diff;

        if (diff > 0) estado = "pendiente";
        else if (diff === 0) estado = "hoy";
        else estado = "atrasada";
      }

      return {
        ...d.toObject(),
        diasRestantes,
        estado
      };
    });

    res.status(200).json(desparasitaciones);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener desparasitaciones por mascota", 
      error: error.message 
    });
  }
};

export const actualizarDesparasitacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido" });
    }

    const { mascotaId } = req.body;
    if (mascotaId && !mongoose.isValidObjectId(mascotaId)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    const desparasitacion = await Desparasitacion.findByIdAndUpdate(id, req.body, { new: true });

    if (!desparasitacion) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.status(200).json({ 
      message: "Desparasitación actualizada con éxito", 
      desparasitacion 
    });
  } catch (error) {
    res.status(400).json({ 
      message: "Error al actualizar desparasitación", 
      error: error.message 
    });
  }
};

export const eliminarDesparasitacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido" });
    }

    const desparasitacion = await Desparasitacion.findByIdAndDelete(id);
    
    if (!desparasitacion) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.status(200).json({ message: "Desparasitación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar desparasitación", 
      error: error.message 
    });
  }
};