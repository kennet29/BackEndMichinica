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
        select: '_id', // Mostrar solo el ID de Ingresos
      })
      .populate({
        path: 'articulos.id_articulo',
        model: 'Articulo',
        select: 'nombre', // Mostrar solo el ID de Articulo
      })
      .populate({
        path: 'articulos.id_categoria',
        model: 'Categoria',
        select: 'categoria', // Mostrar solo el ID de Categoria
      })
      .populate({
        path: 'articulos.id_talla',
        model: 'Talla',
        select: 'talla', // Mostrar solo el ID de Talla
      })
      .populate({
        path: 'articulos.id_color',
        model: 'Color',
        select: 'color', // Mostrar solo el ID de Color
      })
      .populate({
        path: 'articulos.id_marca',
        model: 'Marca',
        select: 'marca', // Mostrar solo el ID de Marca
      })
      .populate({
        path: 'articulos.id_material',
        model: 'Material',
        select: 'material', // Mostrar solo el ID de Material
      })
      .populate({
        path: 'articulos.id_estilo',
        model: 'Estilo',
        select: 'estilo', // Mostrar solo el ID de Estilo
      })
      .populate({
        path: 'articulos.id_diseño',
        model: 'Diseno',
        select: 'diseno', // Mostrar solo el ID de Diseño
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


    pdfDoc.fontSize(30).text('Mafy Store', { align: 'center', x: 145 });


    pdfDoc.moveDown();
    

    const formattedDate = new Date(detalleIngresos.createdAt).toLocaleString('es-ES');
    const textToCenter = `ID-Ingreso; ${detalleIngresos._id} Fecha: ${formattedDate}`;
    
    pdfDoc.fontSize(10).text(textToCenter,165);
    
    pdfDoc.moveDown();
  
    const totalWidth = 400; 

const centerX = (pdfDoc.page.width - totalWidth) / 2;

const tableHeight = 200 + detalleIngresos.articulos.length * 20;

pdfDoc.rect(centerX - 10, 200, totalWidth, tableHeight + 30).stroke();  // Borde externo de la tabla

const innerTableHeight = tableHeight - 20;

pdfDoc
  .fontSize(10)
  .text('Artículos', centerX, 210)
  .text('Categoría', centerX + 50, 210)
  .text('Marca', centerX + 105, 210)
  .text('Talla', centerX + 150, 210)
  .text('Precio', centerX + 190, 210)
  .text('IVA', centerX + 240, 210)
  .text('Cant.', centerX + 290, 210)
  .text('Subtotal', centerX + 340, 210);

detalleIngresos.articulos.forEach((articulo, index) => {
  const yPosition = 230 + index * 20;

  // Borde interno de la tabla
  pdfDoc.rect(centerX - 10, yPosition - 5, totalWidth, 20).stroke();

  pdfDoc
    .fontSize(10)
    .text(articulo.id_articulo.nombre, centerX, yPosition)
    .text(articulo.id_categoria.categoria, centerX + 50, yPosition)
    .text(articulo.id_marca.marca, centerX + 105, yPosition)
    .text(articulo.id_talla.talla, centerX + 150, yPosition)
    .text(articulo.precio_proveedor.toFixed(2), centerX + 190, yPosition)
    .text(articulo.iva.toFixed(2), centerX + 240, yPosition)
    .text(articulo.cantidad, centerX + 290, yPosition)
    .text(articulo.subtotal.toFixed(2), centerX + 340, yPosition);
});


 const totalYPosition = 620 + detalleIngresos.articulos.length * 20;
 pdfDoc
   .fontSize(10)
   .text('Total:', centerX + 225, totalYPosition + 20) // Ajusta el x y y-position
   .text(detalleIngresos.total.toFixed(2), centerX + 270, totalYPosition + 20); // Ajusta el x y y-position

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