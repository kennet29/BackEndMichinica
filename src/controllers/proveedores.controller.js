import Proveedor from "../models/Proveedor.js"

export const getProveedores = async (req, res) => {
  try {
    res.render('proveedores.ejs',{
      cssPaths: ['/css/estilo-footer.css','/css/extras.css' ]
    });
  } catch (error) {
    res.status(500);
    // res.send(error.message);
  }
};
export const getAllProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewProveedor = async (req, res) => {
  const { nombre, direccion, telefono, correo, descripcion, estado } = req.body;
  try {
    const newProveedor = await Proveedor.create({ 
      nombre, 
      direccion, 
      telefono, 
      correo, 
      descripcion, 
      estado
    });
    res.status(201).json(newProveedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProveedorById = async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await Proveedor.findById(id);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProveedorById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProveedor = await Proveedor.findByIdAndRemove(id);
    if (deletedProveedor) {
      res.status(200).json({ message: 'Proveedor eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProveedorById = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, correo, descripcion, estado } = req.body;
  try {
    const updatedProveedor = await Proveedor.findByIdAndUpdate(
      id,
      { 
        nombre, 
        direccion, 
        telefono, 
        correo, 
        descripcion, 
        estado
      },
      { new: true }
    );
    if (updatedProveedor) {
      res.status(200).json(updatedProveedor);
    } else {
      res.status(404).json({ message: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};