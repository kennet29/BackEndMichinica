import DetallesVenta from "../models/DetallesVenta.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';
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




export const printDetallesVenta = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch details of sales from the database with populated references
    const detallesVenta = await DetallesVenta.findById(id)
      .populate({
        path: 'id_ventas', // Assuming the reference field in DetallesVenta is named 'id_ventas'
        model: 'Ventas',
        select: 'cliente createdAt total', // Add other fields as needed
      })
      .populate({
        path: 'articulos.id_articulo',
        model: 'Articulo',
        select: 'nombre',
      })
      .populate({
        path: 'articulos.id_color',
        model: 'Color',
        select: 'color',
      })
      .populate({
        path: 'articulos.id_categoria',
        model: 'Categoria',
        select: 'categoria',
      })
      .populate({
        path: 'articulos.id_marca',
        model: 'Marca',
        select: 'marca',
      })
      .populate({
        path: 'articulos.id_material',
        model: 'Material',
        select: 'material',
      })
      .populate({
        path: 'articulos.id_diseño',
        model: 'Diseno',
        select: 'diseno',
      });

    if (!detallesVenta) {
      return res.status(404).json({ message: 'Detalles de ventas no encontrados' });
    }

    // Create a PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader('Content-Disposition', `attachment; filename=detallesVenta_${id}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe the PDF to the Express response
    doc.pipe(res);

    // Format the date
    const formattedDate = new Date(detallesVenta.id_ventas.createdAt).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Add content to the PDF (customize this based on your needs)
    doc.text(`ID-Factura: ${detallesVenta._id}`);
    doc.text(`Fecha : ${formattedDate}`);
    doc.text(`Cliente : ${detallesVenta.id_ventas.cliente}`);

    // Add table header
    doc.moveDown();
    doc.text('Artículos', { underline: true });

    // Iterate through the articulos array and add details to the table
    detallesVenta.articulos.forEach((articulo, index) => {
      doc.moveDown();
      doc.text(
        `Artículo #${index + 1}\n` +
        ` ${articulo.id_articulo.nombre}` +
        ` ${articulo.id_categoria.categoria}` +
        ` ${articulo.id_color.color}` +
        ` ${articulo.id_marca.marca}` +
        ` ${articulo.id_material.material}` +
        ` ${articulo.id_diseño.diseno}\n` +
        `Cantidad: ${articulo.cantidad} ` +
        `Precio ${articulo.precio} ` +
        `Subtotal${articulo.subtotal}`
      );
    });

    // Show total outside the loop
    doc.text(`Total: ${detallesVenta.id_ventas.total}`);

    // End the document
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
