import DetallesVenta from "../models/DetallesVenta.js";

// Obtener todos los detalles de ventas
export const getAllDetVentas = async (req, res) => {
  try {
    const detallesVentas = await DetallesVenta.find();
    res.status(200).json(detallesVentas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo detalle de venta
export const createNewDetVentas = async (req, res) => {
  const detallesVenta = req.body;

  try {
    const nuevoDetallesVenta = await DetallesVenta.create(detallesVenta);
    res.status(201).json(nuevoDetallesVenta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar detalles de ventas por ID
export const updateDetVentasById = async (req, res) => {
  const { id } = req.params;
  const detallesVenta = req.body;

  try {
    const updatedDetallesVenta = await DetallesVenta.findByIdAndUpdate(
      id,
      detallesVenta,
      { new: true }
    );

    res.status(200).json(updatedDetallesVenta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar detalles de ventas por ID
export const deleteDetallesVentasByID = async (req, res) => {
  const { id } = req.params;

  try {
    await DetallesVenta.findByIdAndRemove(id);
    res.status(204).json({ message: "Detalles de ventas eliminados correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
