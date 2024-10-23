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
import { format } from 'date-fns';

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
        path: 'articulos.id_color',
        model: 'Color',
        select: 'color',
      })
      .populate({
        path: 'articulos.id_talla',
        model: 'Talla',
        select: 'talla',
      });

    if (!detallesVenta) {
      
      return res.status(404).json({ message: 'Detalles de ventas no encontrados' });
    }
    const fechaCreacion = format(new Date(detallesVenta.id_ventas.createdAt), 'dd/MM/yyyy');
    const configuracion = await Configuracion.findOne();

    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }

    const pdfDoc = new PDFDocument({
      size: [240, 400],
    });

    let currentYPosition = 30;

    const centerXPositionBusinessName = (pdfDoc.page.width - pdfDoc.widthOfString(configuracion.nombre_negocio)) / 2;

    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(15)
      .text(configuracion.nombre_negocio, centerXPositionBusinessName, currentYPosition);

    currentYPosition += 35;

    const centerXPositionTextBlock = (pdfDoc.page.width - pdfDoc.widthOfString('Direccion: ' + configuracion.direccion)) / 2;

    pdfDoc
      .font('Helvetica')
      .fontSize(8)
      .text('Direccion: ' + configuracion.direccion, centerXPositionTextBlock, currentYPosition)
      .text(`${'Telefono : ' + configuracion.telefono_1} / ${configuracion.telefono_2}`, centerXPositionTextBlock, currentYPosition + 10);

    currentYPosition += 20;



  pdfDoc
  .font('Helvetica')
  .fontSize(8)
  .text(`ID-Ventas: ${detallesVenta.id_ventas._id}`, centerXPositionTextBlock, currentYPosition)
  .text(`Cliente: ${detallesVenta.id_ventas.cliente}`, centerXPositionTextBlock, currentYPosition + 15)
  .text(`Fecha de Creación: ${fechaCreacion}`, centerXPositionTextBlock, currentYPosition + 30);

currentYPosition += 20;

    let yPosition = 140;

    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(6)
      .text('Producto', 15, yPosition)
      .text('Precio', 120, yPosition)
      .text('Desc', 145, yPosition)
      .text('Cant', 170, yPosition)
      .text('Subtotal', 190, yPosition);

    yPosition += 20;

    detallesVenta.articulos.forEach(articulo => {
      pdfDoc
        .font('Helvetica')
        .fontSize(6)
        .text(`${articulo.id_articulo.nombre}, ${articulo.id_categoria.categoria}, ${articulo.id_marca.marca}, ${articulo.id_color.color}, ${articulo.id_talla.talla}`, 15, yPosition)
        .text(articulo.precio.toString(), 120, yPosition)
        .text(articulo.descuento.toString(), 145, yPosition)
        .text(articulo.cantidad.toString(), 170, yPosition)
        .text(articulo.subtotal.toString(), 190, yPosition);

      yPosition += 15;
    });

    const centerXPositionThanks = (pdfDoc.page.width - pdfDoc.widthOfString('¡Gracias por su compra!')) / 2;

    pdfDoc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(`Total: ${detallesVenta.id_ventas.total}`, 15, yPosition + 20);

pdfDoc
  .font('Helvetica-Oblique')
  .fontSize(12)
  .text('¡Gracias por su compra!', centerXPositionThanks, yPosition + 50);

    res.setHeader('Content-Disposition', `attachment; filename=recibo_${id}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando el PDF' });
  }
};
