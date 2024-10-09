const Factura = require('../models/Factura');


exports.crearFactura = async (req, res) => {
  try {
    const nuevaFactura = new Factura(req.body);
    const facturaGuardada = await nuevaFactura.save();
    res.status(201).json(facturaGuardada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find().populate('servicios.servicio');
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id).populate('servicios.servicio');
    if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.eliminarFactura = async (req, res) => {
  try {
    await Factura.findByIdAndDelete(req.params.id);
    res.json({ message: 'Factura eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
