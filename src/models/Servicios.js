import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  activo: { type: Boolean, default: true },
});

const Servicio = mongoose.model('Servicio', servicioSchema);

export default Servicio;
