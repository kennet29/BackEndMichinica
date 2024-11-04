import Factura from '../models/FacturaServicio.js';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import Configuracion from '../models/Configuracion.js';

export const crearFactura = async (req, res) => {
  try {
    const nuevaFactura = new Factura(req.body);
    const facturaGuardada = await nuevaFactura.save();
    res.status(201).json(facturaGuardada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find().populate('servicios.servicio');
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id).populate('servicios.servicio');
    if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarFactura = async (req, res) => {
  try {
    await Factura.findByIdAndDelete(req.params.id);
    res.json({ message: 'Factura eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const exportFacturasToExcel = async (req, res) => {
  const { startDate, endDate } = req.query;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Fechas inválidas, por favor proporciona un formato de fecha válido (YYYY-MM-DD)' });
  }

  try {
    const facturas = await Factura.find({
      fecha: {
        $gte: start,
        $lte: end,
      }
    }).populate('servicios.servicio');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Facturas');

    worksheet.columns = [
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'IVA', key: 'iva', width: 10 },
      { header: 'Total Factura', key: 'totalFactura', width: 15 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      pattern: 'solid',
      fgColor: { argb: 'FFCCCCCC' }
    };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    facturas.forEach(factura => {
      worksheet.addRow({
        id: factura._id,
        cliente: factura.cliente.nombre,
        fecha: factura.fecha.toISOString().split('T')[0], 
        iva: factura.iva,
        totalFactura: factura.totalFactura,
      }).font = { bold: false }; 

      worksheet.lastRow.alignment = { horizontal: 'center' };

      factura.servicios.forEach(servicio => {
        worksheet.addRow({
          cliente: `  Servicio: ${servicio.servicio.nombre}`,  
          fecha: `  Cantidad: ${servicio.cantidad}`,
          totalFactura: `  Total: ${servicio.total}`,
        }).font = { bold: false }; 
        worksheet.lastRow.alignment = { horizontal: 'center' };
      });
      worksheet.addRow([]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Facturas_${startDate}_to_${endDate}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error al exportar las facturas a Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
};

export const editarFactura = async (req, res) => {
  try {
    const { id } = req.params; 
    const datosActualizados = req.body;
    const facturaActualizada = await Factura.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true }).populate('servicios.servicio');
    res.json(facturaActualizada); 
  } catch (error) {
    res.status(400).json({ message: error.message }); 
  }
};



export const printFactura = async (req, res) => {
  const { id } = req.params;

  try {
    const factura = await Factura.findById(id)
      .populate({
        path: 'servicios.servicio',
        model: 'Servicio',
        select: 'nombre',
      });

    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    const configuracion = await Configuracion.findOne();
    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }

    const fechaFactura = format(new Date(factura.fecha), 'dd/MM/yyyy');


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
      .text(`${'Telefono: ' + configuracion.telefono_1} / ${configuracion.telefono_2}`, centerXPositionTextBlock, currentYPosition + 10);

    currentYPosition += 20;

    pdfDoc
      .font('Helvetica')
      .fontSize(8)
      .text(`Cliente: ${factura.cliente.nombre}`, centerXPositionTextBlock, currentYPosition)
      .text(`Fecha: ${fechaFactura}`, centerXPositionTextBlock, currentYPosition + 15);

    currentYPosition += 40;

    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(6)
      .text('Servicio', 15, currentYPosition)
      .text('Cant', 120, currentYPosition)
      .text('Total', 170, currentYPosition);

    let yPosition = currentYPosition + 20;

    factura.servicios.forEach((servicio) => {
      pdfDoc
        .font('Helvetica')
        .fontSize(6)
        .text(servicio.servicio.nombre, 15, yPosition)
        .text(servicio.cantidad.toString(), 120, yPosition)
        .text(servicio.total.toFixed(2), 170, yPosition);

      yPosition += 15;
    });

    pdfDoc
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(`Subtotal: ${factura.subtotal.toFixed(2)}`, 15, yPosition + 10)
      .text(`IVA: ${factura.iva.toFixed(2)}`, 15, yPosition + 25)
      .text(`Total: ${factura.totalFactura.toFixed(2)}`, 15, yPosition + 40);

    const centerXPositionThanks = (pdfDoc.page.width - pdfDoc.widthOfString('¡Gracias por su compra!')) / 2;
    pdfDoc
      .font('Helvetica-Oblique')
      .fontSize(10)
      .text('¡Gracias por su compra!', centerXPositionThanks, yPosition + 70);

    res.setHeader('Content-Disposition', `attachment; filename=factura_${id}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando el PDF' });
  }
};