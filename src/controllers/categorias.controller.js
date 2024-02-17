import Categoria from "../models/Categorias.js";


export const getAllCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    return res.json(categorias);
  } catch (error) {
    console.error('Error fetching categorias', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCategoriaById = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const categoria = await Categoria.findById(categoriaId);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria not found' });
    }
    res.status(200).json(categoria);
  } catch (error) {
    console.error('Error fetching categoria by ID', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const updateCategoriaById = async (req, res) => {
  try {
    const updatedCategoria = await Categoria.findByIdAndUpdate(
      req.params.categoriaId,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedCategoria) {
      return res.status(404).json({ message: 'Categoria not found' });
    }
    res.status(200).json(updatedCategoria);
  } catch (error) {
    console.error('Error updating categoria by ID', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCategoriaById = async (req, res) => {
  try {
    const { categoriaId } = req.params;

    const deletedCategoria = await Categoria.findByIdAndDelete(categoriaId);
    if (!deletedCategoria) {
      return res.status(404).json({ message: 'Categoria not found' });
    }

    res.status(204).json();
  } catch (error) {
    console.error('Error deleting categoria by ID', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCategoria = async (req, res) => {
  const { categoria, descripcion, estado } = req.body;

  // Verificar si la categoría ya existe
  try {
    const categoriaExistente = await Categoria.findOne({ categoria });

    if (categoriaExistente) {
      // Si la categoría ya existe, enviar un mensaje de error
      return res.status(400).json({ message: 'La categoría ya existe.' });
    }

    // Si la categoría no existe, crear una nueva
    const newCategoria = new Categoria({
      categoria,
      descripcion,
      estado
    });

    const categoriaSaved = await newCategoria.save();

    res.status(201).json(categoriaSaved);
  } catch (error) {
    // Manejar errores durante la consulta o al intentar guardar la categoría
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
