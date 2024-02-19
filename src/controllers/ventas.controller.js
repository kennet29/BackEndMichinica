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