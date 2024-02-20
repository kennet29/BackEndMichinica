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
      })
      .populate({
        path: 'articulos._id',
        model: 'Stock',
        select: 'descuento',
      });
     

    if (!detallesVenta) {
      return res.status(404).json({ message: 'Detalles de ventas no encontrados' });
    }

    const configuracion = await Configuracion.findOne();

    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }

    const pdfDoc = new PDFDocument();

    // Calcular espacio disponible
    const spaceAvailableX = pdfDoc.page.width - 40;
    const spaceAvailableY = pdfDoc.page.height - 40;

    // Ajustar el diseño del borde alrededor del contenido
    const borderWidthPercentage = 0.4;
    const borderHeightPercentage = 0.5;

    const borderXAdjusted = (pdfDoc.page.width - (borderWidthPercentage * spaceAvailableX)) / 2;
    const borderYAdjusted = 35;

    // Dibujar borde alrededor del contenido ajustado
    pdfDoc.rect(borderXAdjusted, borderYAdjusted, borderWidthPercentage * spaceAvailableX, borderHeightPercentage * spaceAvailableY).stroke();

    // Ajuste vertical para el encabezado
    const textYOffset = borderYAdjusted - 10;

    // Encabezado
    pdfDoc.fontSize(24).font('Times-Italic').text('Mafy Store', { align: 'center', y: textYOffset - 10 }).fontSize(10).lineGap(5);

    // Información del artículo
    pdfDoc.text(`ID-Factura: ${detallesVenta._id}`, { align: 'center', y: textYOffset + 15 })
      .text(`Fecha: ${new Date(detallesVenta.id_ventas.createdAt).toLocaleString('es-ES')}`, { align: 'center', y: textYOffset + 25 })
      .text(`Cliente: ${detallesVenta.id_ventas.cliente}`, { align: 'center', y: textYOffset + 35 });

    // Resto del contenido...
    pdfDoc.fontSize(10);

    // Table header
    pdfDoc.text('Producto        Precio  Cant.  Talla  Marca  Subtotal', { fontSize: 8, align: 'center', y: textYOffset + 55 });

    // Table content
    detallesVenta.articulos.forEach((articulo, index) => {
      const yOffset = textYOffset + 55 + index * 8;
      const xOffset = 35;

      pdfDoc.text(`${articulo.id_articulo.nombre.padEnd(15)} ${articulo.precio.toString().padStart(7)} ${articulo.cantidad.toString().padStart(6)} ${articulo.id_talla.talla.padStart(5)} ${articulo.id_marca.marca.padEnd(7)} ${articulo.subtotal.toString().padStart(7)}`, { fontSize: 8, align: 'center', y: yOffset, x: xOffset });
    });

    pdfDoc.text(`Total: ${detallesVenta.id_ventas.total.toFixed(2)}`, { fontSize: 12, align: 'center', y: textYOffset + 75 })
      .text(`Dirección: ${configuracion.direccion}`, { fontSize: 10, align: 'center', y: textYOffset + 85 })
      .text(`E-Mail: ${configuracion.correo_electronico}`, { fontSize: 10, align: 'center', y: textYOffset + 95 })
      .text(`Teléfono 1: ${configuracion.telefono_1}  Teléfono 2: ${configuracion.telefono_2}`, { fontSize: 10, align: 'center', y: textYOffset + 105 })
      .text('Precios incluyen IVA', { fontSize: 10, align: 'center', y: textYOffset + 115 });

      pdfDoc.fontSize(22).text('¡Gracias por su Compra!', { bold: true, align: 'center', y: textYOffset + 125 }).fontSize(10).lineGap(5);





    res.setHeader('Content-Disposition', `attachment; filename=recibo_supermercado_${id}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generando el PDF' });
  }
};
