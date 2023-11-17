import MercanciaDanada from "../models/Mercancia.js";

export const getAllMerc_dañada = async (req, res) => {
  try {
    const mercancias = await MercanciaDanada.find();
    res.json(mercancias);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving all damaged merchandise", error: error.message });
  }
};

export const createNewMerc_dañada = async (req, res) => {
  try {
    const newMercancia = new MercanciaDanada(req.body);
    const savedMercancia = await newMercancia.save();
    res.json(savedMercancia);
  } catch (error) {
    res.status(500).json({ message: "Error creating new damaged merchandise entry", error: error.message });
  }
};

export const getMerc_dañadaByID = async (req, res) => {
  try {
    const mercancia = await MercanciaDanada.findById(req.params.id);
    res.json(mercancia);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving damaged merchandise by ID", error: error.message });
  }
};

export const deleteMerc_dañadaById = async (req, res) => {
  try {
    const deletedMercancia = await MercanciaDanada.findByIdAndDelete(req.params.id);
    res.json(deletedMercancia);
  } catch (error) {
    res.status(500).json({ message: "Error deleting damaged merchandise by ID", error: error.message });
  }
};

export const updateMerc_dañadaById = async (req, res) => {
  try {
    const updatedMercancia = await MercanciaDanada.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedMercancia);
  } catch (error) {
    res.status(500).json({ message: "Error updating damaged merchandise by ID", error: error.message });
  }
};
