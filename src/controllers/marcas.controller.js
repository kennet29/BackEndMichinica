import Marca from "../models/Marcas.js";


export const getAllMarcas = async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.status(200).json(marcas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DeleteMarcas = async (req, res) => {
  const { id } = req.params;
  try {
    await Marca.findByIdAndRemove(id);
    res.status(200).json({ message: 'Marca removida' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CreateMarca = async (req, res) => {
  const { marca, descripcion, estado } = req.body;

  // Verificar si la marca ya existe
  try {
    const marcaExistente = await Marca.findOne({ marca });

    if (marcaExistente) {
      // Si la marca ya existe, enviar un mensaje de error
      return res.status(400).json({ message: 'La marca ya existe.' });
    }

    // Si la marca no existe, crear una nueva
    const newMarca = await Marca.create({ marca, descripcion, estado });
    res.status(201).json(newMarca);
  } catch (error) {
    // Manejar errores durante la consulta o al intentar guardar la marca
    res.status(500).json({ message: error.message });
  }
};


export const UpdateMarca = async (req, res) => {
  const { id } = req.params;
  const { marca, descripcion, estado } = req.body;
  try {
    const updatedMarca = await Marca.findByIdAndUpdate(
      id,
      { marca, descripcion, estado },
      { new: true }
    );
    res.status(200).json(updatedMarca);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};