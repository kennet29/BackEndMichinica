import Diseno from "../models/Diseños.js";

// Crear un nuevo diseño
export const createDiseno = async (req, res) => {
  try {
    const diseno = new Diseno(req.body);
    await diseno.save();
    res.status(201).json(diseno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los diseños
export const getDisenos = async (req, res) => {
  try {
    const disenos = await Diseno.find();
    res.json(disenos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un diseño por idNumerico
export const getDisenoById = async (req, res) => {
  try {
    const diseno = await Diseno.findOne({ idNumerico: req.params.id });
    if (!diseno) return res.status(404).json({ error: "Diseño no encontrado" });
    res.json(diseno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un diseño
export const updateDiseno = async (req, res) => {
  try {
    const diseno = await Diseno.findOneAndUpdate(
      { idNumerico: req.params.id },
      req.body,
      { new: true }
    );
    if (!diseno) return res.status(404).json({ error: "Diseño no encontrado" });
    res.json(diseno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un diseño
export const deleteDiseno = async (req, res) => {
  try {
    const diseno = await Diseno.findOneAndDelete({ idNumerico: req.params.id });
    if (!diseno) return res.status(404).json({ error: "Diseño no encontrado" });
    res.json({ message: "Diseño eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
