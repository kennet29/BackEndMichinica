import Estilo from "../models/Estilo.js";

// Crear un nuevo estilo
export const createEstilo = async (req, res) => {
  try {
    const estilo = new Estilo(req.body);
    await estilo.save();
    res.status(201).json(estilo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los estilos
export const getEstilos = async (req, res) => {
  try {
    const estilos = await Estilo.find();
    res.json(estilos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un estilo por idNumerico
export const getEstiloById = async (req, res) => {
  try {
    const estilo = await Estilo.findOne({ idNumerico: req.params.id });
    if (!estilo) return res.status(404).json({ error: "Estilo no encontrado" });
    res.json(estilo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un estilo
export const updateEstilo = async (req, res) => {
  try {
    const estilo = await Estilo.findOneAndUpdate(
      { idNumerico: req.params.id },
      req.body,
      { new: true }
    );
    if (!estilo) return res.status(404).json({ error: "Estilo no encontrado" });
    res.json(estilo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// E
