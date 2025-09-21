import Mascota from "../models/Mascota.js";
import mongoose from "mongoose";

// Crear mascota
export const crearMascota = async (req, res) => {
  try {
    const { nombre, especie, raza, edad, usuarioId, tarjetaVeterinaria, sexo } = req.body;

    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({ 
        message: "El nombre es obligatorio y debe tener al menos 2 caracteres" 
      });
    }

    if (!especie || especie.trim().length < 3) {
      return res.status(400).json({ 
        message: "La especie es obligatoria y debe tener al menos 3 caracteres" 
      });
    }

    if (!sexo || !["macho", "hembra"].includes(sexo)) {
      return res.status(400).json({ 
        message: "El sexo es obligatorio y debe ser 'macho' o 'hembra'" 
      });
    }

    if (edad !== undefined && (isNaN(edad) || edad < 0 || edad > 50)) {
      return res.status(400).json({ 
        message: "La edad debe ser un número válido entre 0 y 50" 
      });
    }

    if (!usuarioId || !mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ 
        message: "El usuarioId es obligatorio y debe ser válido" 
      });
    }

    if (raza && raza.length < 2) {
      return res.status(400).json({ 
        message: "La raza debe tener al menos 2 caracteres" 
      });
    }

    if (tarjetaVeterinaria !== true && tarjetaVeterinaria !== false) {
      return res.status(400).json({ 
        message: "La tarjetaVeterinaria debe ser un valor booleano (true/false)" 
      });
    }

    // Validar duplicado
    const mascotaExistente = await Mascota.findOne({ 
      usuarioId, 
      nombre: nombre.trim() 
    });

    if (mascotaExistente) {
      return res.status(400).json({ 
        message: "Ya tienes una mascota registrada con ese nombre" 
      });
    }

    const mascota = new Mascota(req.body);
    await mascota.save();

    res.status(201).json({ message: "Mascota registrada con éxito", mascota });
  } catch (error) {
    res.status(400).json({ 
      message: "Error al registrar la mascota", 
      error: error.message 
    });
  }
};

// Obtener todas las mascotas
export const obtenerMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find().populate("usuarioId", "username email");
    res.status(200).json(mascotas);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener las mascotas", 
      error: error.message 
    });
  }
};

// Obtener mascota por ID
export const obtenerMascotaPorId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    const mascota = await Mascota.findById(req.params.id).populate("usuarioId", "username email");

    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    res.status(200).json(mascota);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener la mascota", 
      error: error.message 
    });
  }
};

// Actualizar mascota
export const actualizarMascota = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No se enviaron datos para actualizar" });
    }

    const { nombre, especie, edad, raza, usuarioId, tarjetaVeterinaria, sexo } = req.body;

    if (nombre && nombre.trim().length < 2) {
      return res.status(400).json({ message: "El nombre debe tener al menos 2 caracteres" });
    }

    if (especie && especie.trim().length < 3) {
      return res.status(400).json({ message: "La especie debe tener al menos 3 caracteres" });
    }

    if (sexo && !["macho", "hembra"].includes(sexo)) {
      return res.status(400).json({ 
        message: "El sexo debe ser 'macho' o 'hembra'" 
      });
    }

    if (edad !== undefined && (isNaN(edad) || edad < 0 || edad > 50)) {
      return res.status(400).json({ message: "La edad debe ser un número válido entre 0 y 50" });
    }

    if (usuarioId && !mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: "El usuarioId no es válido" });
    }

    if (raza && raza.length < 2) {
      return res.status(400).json({ message: "La raza debe tener al menos 2 caracteres" });
    }

    if (tarjetaVeterinaria !== undefined && typeof tarjetaVeterinaria !== "boolean") {
      return res.status(400).json({ message: "La tarjetaVeterinaria debe ser un valor booleano (true/false)" });
    }

    if (nombre && usuarioId) {
      const mascotaDuplicada = await Mascota.findOne({
        usuarioId,
        nombre: nombre.trim(),
        _id: { $ne: req.params.id } 
      });

      if (mascotaDuplicada) {
        return res.status(400).json({ message: "Ya tienes otra mascota registrada con ese nombre" });
      }
    }

    const mascota = await Mascota.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    res.status(200).json({ message: "Mascota actualizada con éxito", mascota });
  } catch (error) {
    res.status(400).json({ 
      message: "Error al actualizar la mascota", 
      error: error.message 
    });
  }
};

// Eliminar mascota
export const eliminarMascota = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "El ID de la mascota no es válido" });
    }

    const mascota = await Mascota.findByIdAndDelete(req.params.id);

    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    res.status(200).json({ message: "Mascota eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar la mascota", 
      error: error.message 
    });
  }
};
