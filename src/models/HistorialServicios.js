import mongoose from 'mongoose';

const historialSchema = new mongoose.Schema({
  factura: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Factura', 
    required: true 
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  accion: { 
    type: String, 
    enum: ['CREACION', 'ACTUALIZACION', 'ELIMINACION'], 
    required: true 
  },
  usuario: { 
    type: String, 
    required: true 
  },
  detalles: {
    type: String,
    required: false
  }
});

const Historial = mongoose.model('Historial', historialSchema);

export default Historial;
