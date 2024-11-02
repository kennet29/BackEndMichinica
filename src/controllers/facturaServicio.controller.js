import Factura from '../models/FacturaServicio.js';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

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

  // Convertir las fechas de inicio y fin a objetos Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validar que las fechas sean válidas
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Fechas inválidas, por favor proporciona un formato de fecha válido (YYYY-MM-DD)' });
  }

  try {
    // Consultar facturas dentro del rango de fechas
    const facturas = await Factura.find({
      fecha: {
        $gte: start,
        $lte: end,
      }
    }).populate('servicios.servicio');

    // Crear un nuevo libro y hoja de cálculo con ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Facturas');

    // Definir las columnas de la hoja de cálculo
    worksheet.columns = [
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'IVA', key: 'iva', width: 10 },
      { header: 'Total Factura', key: 'totalFactura', width: 15 },
    ];

    // Aplicar estilo a las cabeceras
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      pattern: 'solid',
      fgColor: { argb: 'FFCCCCCC' } // Cambia este color por el que desees
    };
    worksheet.getRow(1).alignment = { horizontal: 'center' };

    // Agregar las filas de facturas
    facturas.forEach(factura => {
      worksheet.addRow({
        id: factura._id,
        cliente: factura.cliente.nombre,
        fecha: factura.fecha.toISOString().split('T')[0], 
        iva: factura.iva,
        totalFactura: factura.totalFactura,
      }).font = { bold: false }; // Asegúrate de que las filas de datos no estén en negrita

      // Centrar texto de la fila de datos
      worksheet.lastRow.alignment = { horizontal: 'center' };

      // Agregar filas adicionales para cada servicio en la factura
      factura.servicios.forEach(servicio => {
        worksheet.addRow({
          cliente: `  Servicio: ${servicio.servicio.nombre}`,  
          fecha: `  Cantidad: ${servicio.cantidad}`,
          totalFactura: `  Total: ${servicio.total}`,
        }).font = { bold: false }; // Asegúrate de que estas filas también no estén en negrita

        // Centrar texto de las filas de servicios
        worksheet.lastRow.alignment = { horizontal: 'center' };
      });

      // Agregar una fila en blanco después de cada factura para separar visualmente
      worksheet.addRow([]);
    });

    // Configurar encabezados para la descarga de archivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Facturas_${startDate}_to_${endDate}.xlsx`);

    // Escribir el archivo Excel en la respuesta
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