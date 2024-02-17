import Talla from "../models/Tallas.js";

export const getTallas = async (req, res) => {
  try {
    res.render('tallas.ejs',{
      cssPaths: ['/css/estilo-footer.css','/css/extras.css' ]
    });
  } catch (error) {
    res.status(500);

  }
};
export const createNewTalla = async (req, res) => {
  try {
    const newTalla = await Talla.create(req.body);
    res.status(201).json(newTalla);
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear la talla" });
  }
};

export const getAllTallas = async (req, res) => {
  try {
    const tallas = await Talla.find();
    res.status(200).json(tallas);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron obtener las tallas" });
  }
};

export const updateTallaById = async (req, res) => {
  const { id } = req.params;
  try {
    const tallaActualizada = await Talla.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(tallaActualizada);
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar la talla" });
  }
};


export const deleteTallaById = async (req, res) => {
  const { id } = req.params;
  try {
    await Talla.findByIdAndRemove(id);
    res.status(200).json({ message: "Talla eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar la talla" });
  }
};