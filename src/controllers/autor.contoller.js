import Autor from "../models/Autor.js";

export const getAutores = async (req, res) => {
  try {
    res.render("autores.ejs", {
      cssPaths: ["/css/estilo-footer.css", "/css/extras.css"],
    });
  } catch (error) {
    res.status(500).json({ error: "Error al renderizar la vista de autores" });
  }
};

export const createNewAutor = async (req, res) => {
  try {
    const newAutor = await Autor.create(req.body);
    res.status(201).json(newAutor);
  } catch (error) {
    res.status(500).json({ error: error.message || "No se pudo crear el autor" });
  }
};

export const getAllAutores = async (req, res) => {
  try {
    const autores = await Autor.find().populate("userId", "nombre email"); 
    res.status(200).json(autores);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener los autores" });
  }
};

export const updateAutorById = async (req, res) => {
  const { id } = req.params;
  try {
    const autorActualizado = await Autor.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!autorActualizado) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    res.status(200).json(autorActualizado);
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el autor" });
  }
};

export const deleteAutorById = async (req, res) => {
  const { id } = req.params;
  try {
    const autorEliminado = await Autor.findByIdAndRemove(id);
    if (!autorEliminado) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    res.status(200).json({ message: "Autor eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el autor" });
  }
};
