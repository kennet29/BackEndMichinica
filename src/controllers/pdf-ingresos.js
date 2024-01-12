import fs from 'fs';
import PDFDocument from 'pdfkit';

function generarPDF(req, res) {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=ejemplo.pdf');
  doc.pipe(res);
  doc.fontSize(16).text('Hola, este es un PDF generado con pdfkit', 100, 100);
  doc.end();
}

export default generarPDF;
