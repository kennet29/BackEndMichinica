import Categoria from "../models/Categoria.js";

// 📌 Crear categoría
export const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // ✅ Validar campos obligatorios
    if (!nombre || !descripcion) {
      return res.status(400).json({ message: "El nombre y la descripción son requeridos" });
    }

    const categoria = new Categoria({ nombre, descripcion });
    await categoria.save();

    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la categoría", error: error.message });
  }
};

// 📌 Obtener todas las categorías
export const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ createdAt: -1 });
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las categorías", error: error.message });
  }
};

// 📌 Obtener categoría por ID
export const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la categoría", error: error.message });
  }
};

// 📌 Actualizar categoría
export const updateCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion },
      { new: true }
    );

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la categoría", error: error.message });
  }
};

// 📌 Eliminar categoría
export const deleteCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la categoría", error: error.message });
  }
};
