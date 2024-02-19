import DetallesVenta from "../models/DetallesVenta.js";


import Configuracion from "../models/Configuracion.js";


export const getAllDetVentas = async (req, res) => {
  try {
    const detallesVentas = await DetallesVenta.find();
    res.status(200).json(detallesVentas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const obtenerTotalPorCategoriaEnAnio = async (anio) => {
  try {
    const ventasPorCategoria = await DetallesVenta.aggregate([
      {
        $match: {
          'createdAt': {
            $gte: new Date(anio, 0, 1), // Inicio del año
            $lt: new Date(anio + 1, 0, 1), // Fin del año
          },
        },
      },
      {
        $unwind: '$articulos',
      },
      {
        $group: {
          _id: '$articulos.id_categoria',
          totalVendido: { $sum: '$articulos.subtotal' },
        },
      },
      {
        $project: {
          _id: 1,
          totalVendido: 1,
        },
      },
    ]);

    return ventasPorCategoria;
  } catch (error) {
    console.error('Error al obtener el total por categoría:', error);
    throw error;
  }
};




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



export const createNewDetVentas = async (req, res) => {
  const detallesVenta = req.body;

  try {
    const nuevoDetallesVenta = await DetallesVenta.create(detallesVenta);
    res.status(201).json(nuevoDetallesVenta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import PDFDocument from 'pdfkit';
import fs from 'fs';

export const printDetallesVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const detallesVenta = await DetallesVenta.findById(id)
      .populate({
        path: 'id_ventas',
        model: 'Ventas',
        select: 'cliente createdAt total',
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
        path: 'articulos.id_talla',
        model: 'Talla',
        select: 'talla',
      })
      .populate({
        path: 'articulos.id_marca',
        model: 'Marca',
        select: 'marca',
      });

    if (!detallesVenta) {
      return res.status(404).json({ message: 'Detalles de ventas no encontrados' });
    }

    const configuracion = await Configuracion.findOne();

    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }

    const pdfDoc = new PDFDocument();
    const stream = fs.createWriteStream(`detallesVenta_${id}.pdf`);

    pdfDoc.pipe(stream);

    // Add content to PDF
    pdfDoc.fontSize(23).text('Mafy Store', { align: 'center' });
    pdfDoc.fontSize(14).text(`ID-Factura\n${detallesVenta._id}`);
    pdfDoc.fontSize(12).text(`Fecha: ${new Date(detallesVenta.id_ventas.createdAt).toLocaleString('es-ES') }\nCliente: ${detallesVenta.id_ventas.cliente}`);

    // Add table with details
    pdfDoc.table({
      body: [
        ['Artículos', 'Precio', 'Cant.', 'Subtotal'],
        // Add your table data here based on detallesVenta
      ],
      width: [null, null, null, null],
    });

    pdfDoc.fontSize(12).text(`Total: ${detallesVenta.id_ventas.total.toFixed(2)}`);
    pdfDoc.fontSize(12).text(`Dirección: ${configuracion.direccion}`);
    pdfDoc.fontSize(12).text(`E-Mail: ${configuracion.correo_electronico}`);
    pdfDoc.fontSize(12).text(`Teléfono 1: ${configuracion.telefono_1}  Teléfono 2: ${configuracion.telefono_2}`);
    pdfDoc.fontSize(12).text('Precios incluyen IVA', { align: 'center' });
    pdfDoc.fontSize(23).text('¡Gracias por su Compra!', { align: 'center' });

    // Finalize PDF
    pdfDoc.end();

    stream.on('finish', () => {
      res.setHeader('Content-Disposition', `attachment; filename=detallesVenta_${id}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      fs.createReadStream(`detallesVenta_${id}.pdf`).pipe(res);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando el PDF' });
  }
};


