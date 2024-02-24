import Promocion from "../models/Promocion.js";

export const getAllPromociones = async (req, res) => {
  try {
    const promociones = await Promocion.find();
    res.status(200).json(promociones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deletePromocionById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPromocion = await Promocion.findByIdAndRemove(id);
    if (deletedPromocion) {
      res.status(200).json({ message: 'Promocion deleted successfully' });
    } else {
      res.status(404).json({ message: 'Promocion not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createNewPromocion = async (req, res) => {
  const { promocion, fecha_inicio, fecha_final, descuento, descripcion, estado } = req.body;
  try {
    const newPromocion = await Promocion.create({ 
      promocion, 
      fecha_inicio, 
      fecha_final, 
      descuento, 
      descripcion, 
      estado 
    });
    res.status(201).json(newPromocion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  

export const updatePromocionById = async (req, res) => {
  const { id } = req.params;
  const { promocion, fecha_inicio, fecha_final, descuento, descripcion, estado } = req.body;
  try {
    const updatedPromocion = await Promocion.findByIdAndUpdate(
      id,
      { 
        promocion, 
        fecha_inicio, 
        fecha_final, 
        descuento, 
        descripcion, 
        estado 
      },
      { new: true }
    );
    if (updatedPromocion) {
      res.status(200).json(updatedPromocion);
    } else {
      res.status(404).json({ message: 'Promocion not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
