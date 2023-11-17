import Color from "../models/Colores.js";

;
export const crearColor = async (req, res) => {
  try {
    const nuevoColor = await Color.create(req.body);
    res.status(201).json(nuevoColor);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear el color" });
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

