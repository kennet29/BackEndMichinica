import Talla from "../models/Tallas.js";


export const crearTalla = async (req, res) => {
  try {
    const { descripcion, estado, nombre } = req.body;

    const nuevaTalla = new Talla({ descripcion, estado, nombre });
    await nuevaTalla.save();

    res.status(201).json(nuevaTalla);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la talla", error: error.message });
  }
};

export const obtenerTallas = async (req, res) => {
  try {
    const tallas = await Talla.find().sort({ idNumerico: 1 });
    res.status(200).json(tallas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las tallas", error: error.message });
  }
};

// 📌 Obtener una talla por ID
export const obtenerTallaPorId = async (req, res) => {
  try {
    const talla = await Talla.findById(req.params.id);
    if (!talla) {
      return res.status(404).json({ message: "Talla no encontrada" });
    }
    res.status(200).json(talla);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la talla", error: error.message });
  }
};

// 📌 Actualizar una talla
export const actualizarTalla = async (req, res) => {
  try {
    const tallaActualizada = await Talla.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // devuelve el documento actualizado
      runValidators: true,
    });

    if (!tallaActualizada) {
      return res.status(404).json({ message: "Talla no encontrada" });
    }

    res.status(200).json(tallaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la talla", error: error.message });
  }
};

// 📌 Eliminar una talla
export const eliminarTalla = async (req, res) => {
  try {
    const tallaEliminada = await Talla.findByIdAndDelete(req.params.id);
    if (!tallaEliminada) {
      return res.status(404).json({ message: "Talla no encontrada" });
    }

    res.status(200).json({ message: "Talla eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la talla", error: error.message });
  }
};
