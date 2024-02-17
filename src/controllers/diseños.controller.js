import Diseno from "../models/Diseños.js";

export const crearDiseno = async (req, res) => {
  const { diseno, descripcion, estado } = req.body;

  // Verificar si el diseño ya existe
  try {
    const disenoExistente = await Diseno.findOne({ diseno });

    if (disenoExistente) {
      // Si el diseño ya existe, enviar un mensaje de error
      return res.status(400).json({ message: 'El diseño ya existe.' });
    }

    // Si el diseño no existe, crear uno nuevo
    const nuevoDiseno = await Diseno.create({ diseno, descripcion, estado });
    res.status(201).json(nuevoDiseno);
  } catch (error) {
    // Manejar errores durante la consulta o al intentar guardar el diseño
    res.status(500).json({ message: error.message });
  }
};


export const obtenerDisenos = async (req, res) => {
  try {
    const disenos = await Diseno.find();
    res.status(200).json(disenos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los diseños' });
  }
};

export const actualizarDiseno = async (req, res) => {
  const { id } = req.params;
  const { diseno, descripcion, estado } = req.body;
  try {
    const diseñoActualizado = await Diseno.findByIdAndUpdate(
      id,
      { diseno, descripcion, estado },
      { new: true }
    );
    if (diseñoActualizado) {
      res.status(200).json(diseñoActualizado);
    } else {
      res.status(404).json({ message: 'Diseño no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el diseño' });
  }
};

export const eliminarDiseno = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await Diseno.findByIdAndRemove(id);
    if (resultado) {
      res.status(200).json({ message: 'Diseño eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Diseño no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el diseño' });
  }
};