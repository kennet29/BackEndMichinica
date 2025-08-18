import Color from "../models/Colores.js";

export const createColor = async (req, res) => {
  try {
    const color = new Color(req.body);
    await color.save();
    res.status(201).json(color);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getColores = async (req, res) => {
  try {
    const colores = await Color.find();
    res.json(colores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getColorById = async (req, res) => {
  try {
    const color = await Color.findOne({ idNumerico: req.params.id });
    if (!color) return res.status(404).json({ error: "Color no encontrado" });
    res.json(color);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateColor = async (req, res) => {
  try {
    const color = await Color.findOneAndUpdate(
      { idNumerico: req.params.id },
      req.body,
      { new: true }
    );
    if (!color) return res.status(404).json({ error: "Color no encontrado" });
    res.json(color);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteColor = async (req, res) => {
  try {
    const color = await Color.findOneAndDelete({ idNumerico: req.params.id });
    if (!color) return res.status(404).json({ error: "Color no encontrado" });
    res.json({ message: "Color eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
