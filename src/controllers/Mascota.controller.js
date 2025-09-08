import Mascota from "../models/Mascota.js";

export const crearMascota = async (req, res) => {
  try {
    const mascota = new Mascota(req.body);
    await mascota.save();
    res.status(201).json(mascota);
  } catch (error) {
    res.status(400).json({ message: "Error al registrar la mascota", error });
  }
};

export const obtenerMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find().populate("usuarioId", "username email");
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las mascotas", error });
  }
};

export const obtenerMascotaPorId = async (req, res) => {
  try {
    const mascota = await Mascota.findById(req.params.id).populate("usuarioId", "username email");
    if (!mascota) return res.status(404).json({ message: "Mascota no encontrada" });
    res.json(mascota);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la mascota", error });
  }
};

export const actualizarMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mascota) return res.status(404).json({ message: "Mascota no encontrada" });
    res.json(mascota);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar la mascota", error });
  }
};

export const eliminarMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findByIdAndDelete(req.params.id);
    if (!mascota) return res.status(404).json({ message: "Mascota no encontrada" });
    res.json({ message: "Mascota eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la mascota", error });
  }
};