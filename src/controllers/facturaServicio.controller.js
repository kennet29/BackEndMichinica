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


    facturas.forEach(factura => {
      worksheet.addRow({
        cliente: factura.cliente.nombre,
        fecha: factura.fecha.toISOString().split('T')[0], 
        iva: factura.iva,
        totalFactura: factura.totalFactura,
      });

      factura.servicios.forEach(servicio => {
        worksheet.addRow({
          cliente: `  Servicio: ${servicio.servicio.nombre}`,  
          fecha: `  Cantidad: ${servicio.cantidad}`,
          totalFactura: `  Total: ${servicio.total}`,
        });
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
    if (!facturaActualizada) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.json(facturaActualizada); 
  } catch (error) {
    res.status(400).json({ message: error.message }); 
  }
};