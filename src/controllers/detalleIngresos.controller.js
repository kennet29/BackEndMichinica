import DetalleIngresos from "../models/DetalleIngresos.js";

export const getAllDetIngresos = async (req, res) => {
  try {
    const detallesIngresos = await DetalleIngresos.find();
    res.status(200).json(detallesIngresos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewDetIngresos = async (req, res) => {
  const detIngresos = req.body;

  try {
    const newDetIngresos = await DetalleIngresos.create(detIngresos);
    res.status(201).json(newDetIngresos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDetIngresoById = async (req, res) => {
  const { id } = req.params;
  const detIngresos = req.body;

  try {
    const updatedDetIngresos = await DetalleIngresos.findByIdAndUpdate(
      id,
      detIngresos,
      { new: true }
    );

    if (!updatedDetIngresos) {
      return res.status(404).json({ message: "DetalleIngresos not found" });
    }

    res.status(200).json(updatedDetIngresos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDetIngresoByID = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDetIngresos = await DetalleIngresos.findByIdAndRemove(id);

    if (!deletedDetIngresos) {
      return res.status(404).json({ message: "DetalleIngresos not found" });
    }

    res.status(200).json({ message: "DetalleIngresos deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


