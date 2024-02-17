import Bodega from "../models/Bodega.js";
export const getBodega = async (req, res) => {
  try {
    // Aquí puedes renderizar la vista correspondiente si es necesario
    // y definir las rutas CSS, similar a como lo hiciste en el controlador original.
    res.render('bodegas.ejs', {
      cssPaths: ['/css/estilo-footer.css','/css/extras.css' ]
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllBodega = async (req, res) => {
  try {
    const bodegas = await Bodega.find();
    res.status(200).json(bodegas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewBodega = async (req, res) => {
  const { bodega, descripcion, estado } = req.body;

  try {
    const bodegaExistente = await Bodega.findOne({ bodega });
    if (bodegaExistente) {
      return res.status(400).json({ message: 'La bodega ya existe.' });
    }
    const newBodega = await Bodega.create({ bodega, descripcion, estado });
    res.status(201).json(newBodega);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getBodegaById = async (req, res) => {
  const { id } = req.params;
  try {
    const bodega = await Bodega.findById(id);
    if (bodega) {
      res.status(200).json(bodega);
    } else {
      res.status(404).json({ message: 'Bodega not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBodegaById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBodega = await Bodega.findByIdAndDelete(id);
    if (deletedBodega) {
      res.status(200).json({ message: 'Bodega deleted successfully' });
    } else {
      res.status(404).json({ message: 'Bodega not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTotalBodegas = async (req, res) => {
  try {
    const totalBodegas = await Bodega.countDocuments();
    res.status(200).json({ totalBodegas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBodegaById = async (req, res) => {
  const { id } = req.params;
  const { bodega, descripcion, estado } = req.body;
  try {
    const updatedBodega = await Bodega.findByIdAndUpdate(
      id,
      { bodega, descripcion, estado },
      { new: true }
    );
    if (updatedBodega) {
      res.status(200).json(updatedBodega);
    } else {
      res.status(404).json({ message: 'Bodega not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};