import Estilo from "../models/Estilo.js";

export const createEstilo = async (req, res) => {
  try {
    const { estilo, descripcion, estado } = req.body;

    const nuevoEstilo = new Estilo({ estilo, descripcion, estado });
    await nuevoEstilo.save();

    res.status(201).json(nuevoEstilo);
  } catch (error) {
    res.status(500).json({ message: "Error al crear estilo", error });
  }
};

export const getEstilos = async (req, res) => {
  try {
    const estilos = await Estilo.find().sort({ idNumerico: 1 });
    res.json(estilos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estilos", error });
  }
};

export const getEstiloById = async (req, res) => {
  try {
    const { id } = req.params;
    const estilo = await Estilo.findOne({ idNumerico: id });

    if (!estilo) return res.status(404).json({ message: "Estilo no encontrado" });

    res.json(estilo);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar estilo", error });
  }
};

export const updateEstilo = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const estilo = await Estilo.findOneAndUpdate({ idNumerico: id }, data, {
      new: true,
    });

    if (!estilo) return res.status(404).json({ message: "Estilo no encontrado" });

    res.json(estilo);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estilo", error });
  }
};

export const deleteEstilo = async (req, res) => {
  try {
    const { id } = req.params;
    const estilo = await Estilo.findOneAndDelete({ idNumerico: id });

    if (!estilo) return res.status(404).json({ message: "Estilo no encontrado" });

    res.json({ message: "Estilo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar estilo", error });
  }
};