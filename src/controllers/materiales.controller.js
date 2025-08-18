import Material from "../models/Material.js";

// Crear un nuevo material
export const createMaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los materiales
export const getMateriales = async (req, res) => {
  try {
    const materiales = await Material.find().sort({ idNumerico: 1 });
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un material por idNumerico
export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findOne({ idNumerico: req.params.id });
    if (!material) return res.status(404).json({ error: "Material no encontrado" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un material
export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findOneAndUpdate(
      { idNumerico: req.params.id },
      req.body,
      { new: true }
    );
    if (!material) return res.status(404).json({ error: "Material no encontrado" });
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un material
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findOneAndDelete({ idNumerico: req.params.id });
    if (!material) return res.status(404).json({ error: "Material no encontrado" });
    res.json({ message: "Material eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
