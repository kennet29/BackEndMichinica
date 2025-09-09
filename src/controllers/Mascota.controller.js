import Mascota from "../models/Mascota.js";

// Crear mascota
export const crearMascota = async (req, res) => {
  try {
    const { nombre, especie, raza, edad, usuarioId } = req.body;

    // Validaciones básicas
    if (!nombre || !especie || !usuarioId) {
      return res.status(400).json({ 
        message: "Faltan datos obligatorios (nombre, especie, usuarioId)" 
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

// Obtener una mascota por ID
export const obtenerMascotaPorId = async (req, res) => {
  try {
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
    const { nombre, especie, edad } = req.body;

    // Validar si vienen datos vacíos
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No se enviaron datos para actualizar" });
    }

    const mascota = await Mascota.findByIdAndUpdate(
      req.params.id, 
      { nombre, especie, edad, ...req.body }, 
      { new: true }
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
