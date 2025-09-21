import Operacion from "../models/Operaciones.js";

// =============================
// Crear operación
// =============================
export const crearOperacion = async (req, res) => {
  try {
    const { mascotaId, fecha, tipo } = req.body;

    if (!mascotaId || !fecha || !tipo) {
      return res.status(400).json({
        message: "Los campos mascotaId, fecha y tipo son obligatorios",
      });
    }

    const operacion = new Operacion(req.body);
    await operacion.save();

    res
      .status(201)
      .json({ message: "Operación registrada con éxito", operacion });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al registrar operación", error: error.message });
  }
};

// =============================
// Obtener todas las operaciones
// =============================
export const obtenerOperaciones = async (req, res) => {
  try {
    const operaciones = await Operacion.find().sort({ fecha: -1 });
    res.status(200).json(operaciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener operaciones", error: error.message });
  }
};

// =============================
// Obtener todas las operaciones de una mascota
// =============================
export const obtenerOperacionesPorMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    if (!mascotaId) {
      return res
        .status(400)
        .json({ message: "Se requiere el ID de la mascota" });
    }

    const operaciones = await Operacion.find({ mascotaId }).sort({ fecha: -1 });

    if (operaciones.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron operaciones para esta mascota" });
    }

    res.status(200).json(operaciones);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener operaciones", error: error.message });
  }
};

// =============================
// Obtener una operación por ID
// =============================
export const obtenerOperacionPorId = async (req, res) => {
  try {
    const operacion = await Operacion.findById(req.params.id);

    if (!operacion) {
      return res.status(404).json({ message: "Operación no encontrada" });
    }

    res.status(200).json(operacion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener operación", error: error.message });
  }
};

// =============================
// Actualizar operación
// =============================
export const actualizarOperacion = async (req, res) => {
  try {
    const operacion = await Operacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!operacion) {
      return res.status(404).json({ message: "Operación no encontrada" });
    }

    res
      .status(200)
      .json({ message: "Operación actualizada con éxito", operacion });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al actualizar operación", error: error.message });
  }
};

// =============================
// Eliminar operación
// =============================
export const eliminarOperacion = async (req, res) => {
  try {
    const operacion = await Operacion.findByIdAndDelete(req.params.id);

    if (!operacion) {
      return res.status(404).json({ message: "Operación no encontrada" });
    }

    res.status(200).json({ message: "Operación eliminada con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar operación", error: error.message });
  }
};
