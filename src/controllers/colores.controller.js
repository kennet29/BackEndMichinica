import Color from "../models/Colores.js";


export const crearColor = async (req, res) => {
  const { color, codigo, estado } = req.body;

  // Verificar si el color ya existe
  try {
    const colorExistente = await Color.findOne({ color });

    if (colorExistente) {
      // Si el color ya existe, enviar un mensaje de error
      return res.status(400).json({ error: 'El color ya existe.' });
    }

    // Si el color no existe, crear uno nuevo
    const nuevoColor = await Color.create({ color, codigo, estado });
    res.status(201).json(nuevoColor);
  } catch (error) {
    // Manejar errores durante la consulta o al intentar guardar el color
    console.error(error);
    res.status(500).json({ error: 'No se pudo crear el color' });
  }
};


// Controlador para mostrar todos los colores
export const mostrarColores = async (req, res) => {
  try {
    const colores = await Color.find();
    res.status(200).json(colores);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los colores" });
  }
};

// Controlador para editar un color por su ID
export const editarColor = async (req, res) => {
  const { id } = req.params;
  try {
    const colorActualizado = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(colorActualizado);
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el color" });
  }
};

// Controlador para eliminar un color por su ID
export const eliminarColor = async (req, res) => {
  const { id } = req.params;
  try {
    await Color.findByIdAndRemove(id);
    res.status(200).json({ message: "Color eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el color" });
  }
};

// Controlador para obtener un color por su ID
export const obtenerColorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const color = await Color.findById(id);
    
    if (!color) {
      return res.status(404).json({ error: "Color no encontrado" });
    }

    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el color" });
  }
};
