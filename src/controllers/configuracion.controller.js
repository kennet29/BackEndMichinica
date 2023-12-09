import Configuracion from "../models/Configuracion.js";



export const crearConfiguracion = async (req, res) => {
  try {
    const nuevaConfiguracion = await Configuracion.create(req.body);
    res.status(201).json({ message: "Configuración creada exitosamente", data: nuevaConfiguracion });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la configuración", error: error.message });
  }
};

// Controlador para obtener todas las configuraciones
export const verConfiguraciones = async (req, res) => {
  try {
    const configuraciones = await Configuracion.find();
    res.status(200).json({ data: configuraciones });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las configuraciones", error: error.message });
  }
};

// Controlador para editar una configuración por su ID
export const editarConfiguracion = async (req, res) => {
  try {
    const primeraConfiguracion = await Configuracion.findOne();
    if (!primeraConfiguracion) {
      return res.status(404).json({ message: "No se encontró ninguna configuración para editar" });
    }

    const configuracionActualizada = await Configuracion.findOneAndUpdate(
      { _id: primeraConfiguracion._id },
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Configuración actualizada exitosamente", data: configuracionActualizada });
  } catch (error) {
    res.status(500).json({ message: "Error al editar la configuración", error: error.message });
  }
};

