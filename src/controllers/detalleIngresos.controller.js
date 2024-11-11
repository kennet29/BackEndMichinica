import DetalleIngresos from "../models/DetalleIngresos.js";
import path from 'path';
import PDFDocument from 'pdfkit';
import PDFTable from 'pdfkit-table';
import fs from 'fs';
import Configuracion from "../models/Configuracion.js";


export const getAllDetIngresos = async (req, res) => {
  try {
    const detallesIngresos = await DetalleIngresos.find();
    res.status(200).json(detallesIngresos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewDetIngresos = async (req, res) => {
  const detIngresos = req.body;

  try {
    const newDetIngresos = await DetalleIngresos.create(detIngresos);
    res.status(201).json(newDetIngresos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDetIngresoById = async (req, res) => {
  const { id } = req.params;
  const detIngresos = req.body;

  try {
    const updatedDetIngresos = await DetalleIngresos.findByIdAndUpdate(
      id,
      detIngresos,
      { new: true }
    );

    if (!updatedDetIngresos) {
      return res.status(404).json({ message: "DetalleIngresos not found" });
    }

    res.status(200).json(updatedDetIngresos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDetIngresoByID = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDetIngresos = await DetalleIngresos.findByIdAndRemove(id);

    if (!deletedDetIngresos) {
      return res.status(404).json({ message: "DetalleIngresos not found" });
    }

    res.status(200).json({ message: "DetalleIngresos deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { format } from 'date-fns'; 

export const printDetalleIngresos = async (req, res) => {
  const { id } = req.params;

  try {
    const detalleIngresos = await DetalleIngresos.findById(id)
      .populate({
        path: 'id_ingreso',
        model: 'Ingresos',
        select: '_id',
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
        path: 'articulos.id_talla',
        model: 'Talla',
        select: 'talla',
      })
      .populate({
        path: 'articulos.id_color',
        model: 'Color',
        select: 'color',
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
        path: 'articulos.id_estilo',
        model: 'Estilo',
        select: 'estilo',
      });

    if (!detalleIngresos) {
      return res.status(404).json({ message: 'Detalle de ingresos no encontrado' });
    }

    const configuracion = await Configuracion.findOne();

    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }

    const pdfDoc = new PDFDocument({ size: 'A4' });
    let currentYPosition = 30;

    const centerXPositionBusinessName = (pdfDoc.page.width - pdfDoc.widthOfString(configuracion.nombre_negocio)) / 2;

    // Encabezado con datos de Configuración
    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(20)
      .text(configuracion.nombre_negocio, centerXPositionBusinessName, currentYPosition);

    currentYPosition += 35;

    // Información de dirección y teléfono alineada a la derecha
    const leftMargin = 50;
    pdfDoc
      .font('Helvetica')
      .fontSize(12)
      .text(`Dirección: ${configuracion.direccion}`, leftMargin, currentYPosition)
      .text(`Teléfono: ${configuracion.telefono_1} / ${configuracion.telefono_2}`, leftMargin, currentYPosition + 15);

    currentYPosition += 30;

    const formattedDate = format(new Date(detalleIngresos.createdAt), 'dd/MM/yyyy');
    pdfDoc
      .font('Helvetica')
      .fontSize(12)
      .text(`ID-Ingreso: ${detalleIngresos._id}`, leftMargin, currentYPosition)
      .text(`Fecha: ${formattedDate}`, leftMargin, currentYPosition + 15);

    currentYPosition += 30;

    // Tabla de artículos con bordes y márgenes internos
    let yPosition = currentYPosition + 20;
    const totalWidth = 520;
    const startX = (pdfDoc.page.width - totalWidth) / 2;
    const cellPadding = 5; // Espacio interno en cada celda

    // Encabezado de la tabla
    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('Artículo', startX + cellPadding, yPosition)
      .text('Categoría', startX + 60 + cellPadding, yPosition)
      .text('Marca', startX + 115 + cellPadding, yPosition)
      .text('Talla', startX + 170 + cellPadding, yPosition)
      .text('Color', startX + 225 + cellPadding, yPosition)
      .text('Precio', startX + 275 + cellPadding, yPosition)
      .text('Cantidad', startX + 340 + cellPadding, yPosition)
      .text('Subtotal', startX + 395 + cellPadding, yPosition)
      .text('IVA', startX + 455 + cellPadding, yPosition);

    // Dibuja borde para el encabezado
    pdfDoc.rect(startX, yPosition - 2, totalWidth, 20).stroke();

    yPosition += 20;

    // Filas de artículos
    detalleIngresos.articulos.forEach((articulo) => {
      pdfDoc
        .font('Helvetica')
        .fontSize(10)
        .text(articulo.id_articulo.nombre, startX + cellPadding, yPosition)
        .text(articulo.id_categoria.categoria, startX + 60 + cellPadding, yPosition)
        .text(articulo.id_marca.marca, startX + 115 + cellPadding, yPosition)
        .text(articulo.id_talla.talla, startX + 170 + cellPadding, yPosition)
        .text(articulo.id_color.color, startX + 225 + cellPadding, yPosition)
        .text(articulo.precio_proveedor.toFixed(2), startX + 275 + cellPadding, yPosition)
        .text(articulo.cantidad.toString(), startX + 340 + cellPadding, yPosition)
        .text(articulo.subtotal.toFixed(2), startX + 395 + cellPadding, yPosition)
        .text(articulo.iva.toFixed(2), startX + 455 + cellPadding, yPosition);

      // Dibuja borde alrededor de cada fila
      pdfDoc.rect(startX, yPosition - 2, totalWidth, 15).stroke();

      yPosition += 15;
    });

    currentYPosition = yPosition + 20;

    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text(`Total C$: ${detalleIngresos.total.toFixed(2)}`, 75, currentYPosition);

    const centerXPositionThanks = (pdfDoc.page.width - pdfDoc.widthOfString('¡Gracias por su compra!')) / 2;

    pdfDoc
      .font('Helvetica-Oblique')
      .fontSize(14)
      .text('¡Gracias por su compra!', centerXPositionThanks, currentYPosition + 20);

    res.setHeader('Content-Disposition', `attachment; filename=detalleIngresos_${id}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando el PDF' });
  }
};