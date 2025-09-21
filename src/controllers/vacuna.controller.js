import Vacuna from "../models/Vacuna.js";

// Crear vacuna
export const crearVacuna = async (req, res) => {
  try {
    const { nombre, fecha, mascotaId } = req.body;

    if (!nombre || !fecha || !mascotaId) {
      return res.status(400).json({
        message: "El nombre, la fecha y la mascotaId son obligatorios",
      });
    }

    const vacuna = new Vacuna(req.body);
    await vacuna.save();

    res.status(201).json({ message: "Vacuna creada con éxito", vacuna });
  } catch (error) {
    res.status(400).json({ message: "Error al crear vacuna", error: error.message });
  }
};

// Obtener todas las vacunas de una mascota
export const obtenerVacunas = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    if (!mascotaId) {
      return res.status(400).json({ message: "Se requiere el ID de la mascota" });
    }

    const vacunas = await Vacuna.find({ mascotaId });
    res.status(200).json(vacunas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vacunas", error: error.message });
  }
};

// Obtener una vacuna por ID
export const obtenerVacunaPorId = async (req, res) => {
  try {
    const vacuna = await Vacuna.findById(req.params.id);

    if (!vacuna) {
      return res.status(404).json({ message: "Vacuna no encontrada" });
    }

    res.status(200).json(vacuna);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vacuna", error: error.message });
  }
};

// Actualizar vacuna
export const actualizarVacuna = async (req, res) => {
  try {
    const { nombre, fecha } = req.body;

    if (!nombre && !fecha) {
      return res.status(400).json({
        message: "Debes proporcionar al menos un campo para actualizar (nombre o fecha)",
      });
    }

    const vacuna = await Vacuna.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vacuna) {
      return res.status(404).json({ message: "Vacuna no encontrada" });
    }

    res.status(200).json({ message: "Vacuna actualizada con éxito", vacuna });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar vacuna", error: error.message });
  }
};

// Eliminar vacuna
export const eliminarVacuna = async (req, res) => {
  try {
    const vacuna = await Vacuna.findByIdAndDelete(req.params.id);

    if (!vacuna) {
      return res.status(404).json({ message: "Vacuna no encontrada" });
    }

    res.status(200).json({ message: "Vacuna eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar vacuna", error: error.message });
  }
};


// Obtener todas las vacunas de una mascota
export const obtenerVacunasPorMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;

    if (!mascotaId) {
      return res.status(400).json({ message: "Se requiere el ID de la mascota" });
    }

    const vacunas = await Vacuna.find({ mascotaId }).sort({ fecha: -1 }); 
    // el sort es opcional, ordena de la más reciente a la más antigua

    if (vacunas.length === 0) {
      return res.status(404).json({ message: "No se encontraron vacunas para esta mascota" });
    }

    res.status(200).json(vacunas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vacunas", error: error.message });
  }
};
