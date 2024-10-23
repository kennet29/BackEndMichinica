import Ventas from "../models/Ventas.js";

// Get all sales
export const getAllVentas = async (req, res) => {
  try {
    const ventas = await Ventas.find();
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error: error.message });
  }
};

export const obtenerVentasTotalesPorMes = async (req, res) => {
  try {
    const ventasPorMes = await Ventas.aggregate([
      {
        $match: {
          fecha: {
            $gte: new Date(`${new Date().getFullYear()}-01-01`),
            $lt: new Date(`${new Date().getFullYear() + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$fecha' },
          ventasTotales: { $sum: '$total' },
        },
      },
    ]);

    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const totalesPorMes = {};
    
    nombresMeses.forEach((mes, index) => {
      totalesPorMes[mes] = 0;
    });

    // Actualizar los totales con las ventas reales
    ventasPorMes.forEach((venta) => {
      const nombreMes = nombresMeses[venta._id - 1];
      totalesPorMes[nombreMes] = venta.ventasTotales;
    });

    // Formatear los resultados
    const resultadosFormateados = nombresMeses.map((nombreMes) => ({
      mes: nombreMes,
      ventasTotales: totalesPorMes[nombreMes],
    }));

    res.json(resultadosFormateados);
  } catch (error) {
    console.error('Error al obtener las ventas por mes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




// Create a new sale
export const createNewVenta = async (req, res) => {
  const ventaData = req.body;

  try {
    const nuevaVenta = await Ventas.create(ventaData);
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(500).json({ message: "Error creating sale", error: error.message });
  }
};

// Update sale by ID
export const updateVentasById = async (req, res) => {
  const { id } = req.params;
  const updatedVentaData = req.body;

  try {
    const venta = await Ventas.findByIdAndUpdate(id, updatedVentaData, { new: true });
    if (!venta) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ message: "Error updating sale", error: error.message });
  }
};


export const deleteVentasByID = async (req,res) =>
{


}


export const getVentaById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const venta = await Ventas.findById(id);
      if (!venta) {
        return res.status(404).json({ message: "Sale not found" });
      }
      res.status(200).json(venta);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sale by ID", error: error.message });
    }
  };


  export const sumarTotalVentasPorAnio = async (anio) => {
    try {
      const primerDiaAnio = new Date(`${anio}-01-01`);
      const ultimoDiaAnio = new Date(`${anio + 1}-01-01`);
  
      const resultado = await Ventas.aggregate([
        {
          $match: {
            fecha: {
              $gte: primerDiaAnio,
              $lt: ultimoDiaAnio,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalVentasAnio: { $sum: '$total' },
          },
        },
      ]);
  
      if (resultado.length > 0) {
        return resultado[0].totalVentasAnio;
      } else {
        return 0;  // Si no hay ventas en el año especificado, devolver cero o el valor que consideres apropiado
      }
    } catch (error) {
      console.error(`Error al sumar los totales de ventas del año ${anio}:`, error);
      throw error;
    }
  };



import ExcelJS from 'exceljs';

export const exportVentasToExcel = async (req, res) => {
  const { startDate, endDate } = req.query;


  const start = new Date(startDate);
  const end = new Date(endDate);


  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Fechas inválidas, por favor proporciona un formato de fecha válido (YYYY-MM-DD)' });
  }

  try {

    const ventas = await Ventas.find({
      fecha: {
        $gte: start,
        $lte: end,
      }
    });


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');


    worksheet.columns = [
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Descuento', key: 'descuento', width: 10 },
      { header: 'Subtotal', key: 'subtotal', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Estado', key: 'estado', width: 10 },
    ];


    ventas.forEach(venta => {
      worksheet.addRow({
        cliente: venta.cliente,
        fecha: venta.fecha.toISOString().split('T')[0],  
        descuento: venta.descuento,
        subtotal: venta.subtotal,
        total: venta.total,
        estado: venta.estado ? 'Completada' : 'Pendiente',
      });
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Ventas_${startDate}_to_${endDate}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error al exportar las ventas a Excel:', error);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
};
