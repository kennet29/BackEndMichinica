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
  const { nombre, descripcion, estado } = req.body;

  // Verificar si el artículo ya existe
  try {
    const articuloExistente = await Articulo.findOne({ nombre });

    if (articuloExistente) {
      // Si el artículo ya existe, enviar un mensaje de error
      return res.status(400).json({ message: 'El artículo ya existe.' });
    }

    // Si el artículo no existe, crear uno nuevo
    const nuevoArticulo = new Articulo({ nombre, descripcion, estado });
    const articuloCreado = await nuevoArticulo.save();
    res.status(201).json(articuloCreado);
  } catch (error) {
    // Manejar errores durante la consulta o al intentar guardar el artículo
    res.status(500).json({ message: error.message });
  }
};


export const updateArticuloById = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado } = req.body;

  

  const updatedArticulo = { nombre, descripcion, estado,  _id: id };

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

export const obtenerArticuloPorId = async (req, res) => {
  const { id } = req.params;

  try {
   
    

    const articulo = await Articulo.findById(id);
 
    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    
    res.status(200).json(articulo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el artículo', error: error.message });
  }
};
