const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  activo: { type: Boolean, default: true },
});

const Servicio = mongoose.model('Servicio', servicioSchema);
module.exports = Servicio;
