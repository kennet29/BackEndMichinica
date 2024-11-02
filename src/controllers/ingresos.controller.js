import Ingresos from "../models/Ingresos.js";
import fs from 'fs';
import PDFDocument from 'pdfkit';
import Proveedor from "../models/Proveedor.js"; 

export const getAllIngresos = async (req, res) => {
    try {
      const ingresos = await Ingresos.find();
      res.status(200).json(ingresos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
export const createNewIngresos = async (req, res) => {
    const ingreso = req.body;
  
    try {
      const newIngreso = await Ingresos.create(ingreso);
      res.status(201).json(newIngreso);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const updateIngresoById = async (req, res) => {
    const { id } = req.params;
    const ingreso = req.body;
  
    try {
      const updatedIngreso = await Ingresos.findByIdAndUpdate(id, ingreso, { new: true });
      res.status(200).json(updatedIngreso);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  export const deleteIngresoByID = async (req, res) => {
    const { id } = req.params;
  
    try {
      await Ingresos.findByIdAndRemove(id);
      res.status(204).json({ message: 'Ingreso deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
  export const getIngresoById = async (req, res) => {
    try {
      const ingreso = await Ingresos.findById(req.params.id).populate('id_proveedor');
  
      if (!ingreso) {
        return res.status(404).json({ message: "Ingreso no encontrado" });
      }
  
      const proveedorNombre = ingreso.id_proveedor ? ingreso.id_proveedor.nombre : "Proveedor no encontrado";
  
      return res.json({
        id: ingreso._id,
        fecha: ingreso.fecha,
        iva: ingreso.iva,
        descuento: ingreso.descuento,
        subtotal: ingreso.subtotal,
        total: ingreso.total,
        proveedor: proveedorNombre, 
      });
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el ingreso", error: error.message });
    }
  };


import excel from 'exceljs';
export const exportIngresosToExcel = async (req, res) => {
  const { startDate, endDate } = req.query;

  console.log("Fechas recibidas:", { startDate, endDate }); 

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    console.log("Fechas convertidas a Date:", { start, end }); 

    const ingresos = await Ingresos.find({
      fecha: { $gte: start, $lte: end },
    }).populate('id_proveedor');

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Ingresos');

    worksheet.columns = [
      { header: 'Nombre Proveedor', key: 'nombre_proveedor', width: 30 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'IVA', key: 'iva', width: 10 },
      { header: 'Descuento', key: 'descuento', width: 10 },
      { header: 'Subtotal', key: 'subtotal', width: 10 },
      { header: 'Total', key: 'total', width: 10 },
    ];

    ingresos.forEach((ingreso) => {
      const nombreProveedor = ingreso.id_proveedor ? ingreso.id_proveedor.nombre : 'Proveedor no encontrado';
      worksheet.addRow({
        nombre_proveedor: nombreProveedor,
        fecha: ingreso.fecha,
        iva: ingreso.iva,
        descuento: ingreso.descuento,
        subtotal: ingreso.subtotal,
        total: ingreso.total,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ingresos.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al exportar ingresos a Excel:", error);
    res.status(500).json({ message: 'Error al exportar ingresos a Excel', error: error.message });
  }
};
