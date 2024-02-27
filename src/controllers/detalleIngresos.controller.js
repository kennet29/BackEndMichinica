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
      })
      .populate({
        path: 'articulos.id_color',
        model: 'Color',
        select: 'color',
      });

     
    
      if (!detalleIngresos) {
        return res.status(404).json({ message: 'Detalle de ingresos no encontrado' });
      }
  
      const configuracion = await Configuracion.findOne();
  
      if (!configuracion) {
        return res.status(404).json({ message: 'Configuración no encontrada' });
      }
  
      const pdfDoc = new PDFDocument();
      const filePath = path.resolve(`detalleIngresos_${id}.pdf`);
      const writeStream = fs.createWriteStream(filePath);
  
      pdfDoc.pipe(writeStream);
  
      // Encabezado with Configuracion data
      pdfDoc.fontSize(18).text(configuracion.nombre_negocio, { align: 'center' });
      pdfDoc.fontSize(10).text(`${configuracion.direccion} | Teléfono: ${configuracion.telefono_1}/ ${configuracion.telefono_2} `, { align: 'center' });
  
      pdfDoc.moveDown();
  
      // Detalles del recibo
      const formattedDate = new Date(detalleIngresos.createdAt).toLocaleString('es-ES');
      pdfDoc.fontSize(10).text(`ID-Ingreso: ${detalleIngresos._id}`, { align: 'center' });
      pdfDoc.fontSize(10).text(`Fecha: ${formattedDate}`, { align: 'center' });
  
      pdfDoc.moveDown();
  
      // Tabla de artículos
      const totalWidth = 500;
      const totalHeight = 230; // Altura del borde de la tabla
      const centerX = ((pdfDoc.page.width - totalWidth) / 2 + 5);
      const headerY = pdfDoc.y + 10;
  
      // Añadir borde exterior a la tabla con altura ajustada a 500
      pdfDoc.rect(centerX, headerY - 5, totalWidth, totalHeight).stroke();
  
      pdfDoc
        .fontSize(10)
        .text('Artículo', centerX + 10, headerY)
        .text('Categoría', centerX + 60, headerY)
        .text('Marca', centerX + 120, headerY)
        .text('Talla', centerX + 170, headerY)
        .text('Color', centerX + 210, headerY)
        .text('Precio', centerX + 250, headerY)
        .text('Cantidad', centerX + 300, headerY)
        .text('Subtotal', centerX + 360, headerY)
        .text('IVA', centerX + 440, headerY);
  
      detalleIngresos.articulos.forEach((articulo, index) => {
        const yPosition = pdfDoc.y + 5 + index * 20;
  
        pdfDoc
          .fontSize(10)
          .text(articulo.id_articulo.nombre, centerX + 10, yPosition + 10)
          .text(articulo.id_categoria.categoria, centerX + 60, yPosition + 10)
          .text(articulo.id_marca.marca, centerX + 120, yPosition + 10)
          .text(articulo.id_talla.talla, centerX + 170, yPosition + 10)
          .text(articulo.id_color.color, centerX + 210, yPosition + 10)
          .text(articulo.precio_proveedor.toFixed(2), centerX + 250, yPosition + 10)
          .text(articulo.cantidad.toString(), centerX + 300, yPosition + 10)
          .text(articulo.subtotal.toFixed(2), centerX + 360, yPosition + 10)
          .text(articulo.iva.toFixed(2), centerX + 440, yPosition + 10);
      });
  
      pdfDoc.moveDown();
      pdfDoc.fontSize(10).text(`Total C$: ${detalleIngresos.total.toFixed(2)}`, 75, 400);
  
      pdfDoc.end();
  
      writeStream.on('finish', () => {
        res.setHeader('Content-Disposition', `attachment; filename=detalleIngresos_${id}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).sendFile(filePath);
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generando el PDF' });
    }
  };