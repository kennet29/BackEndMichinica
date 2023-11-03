import Articulo from "../models/Articulo.js";



export const getAllArticulos = async (req, res) => {
  try {
    const articulos = await Articulo.find();
    res.status(200).json(articulos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewArticulo = async (req, res) => {
  const { nombre, descripcion, estado, categoria } = req.body;
  const nuevoArticulo = new Articulo({ nombre, descripcion, estado, categoria });

  try {
    const articuloCreado = await nuevoArticulo.save();
    res.status(201).json(articuloCreado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateArticuloById = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado, categoria } = req.body;

  

  const updatedArticulo = { nombre, descripcion, estado, categoria, _id: id };

  try {
    await Articulo.findByIdAndUpdate(id, updatedArticulo, { new: true });
    res.json(updatedArticulo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteArticuloById = async (req, res) => {
  const { id } = req.params;

  try {
    await Articulo.findByIdAndRemove(id);
    res.json({ message: 'Artículo eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};