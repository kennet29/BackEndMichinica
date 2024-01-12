import mongoose from 'mongoose';

const ventasSchema = new mongoose.Schema(
  {
    cliente: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    descuento: {
      type: Number,
      required: true,
    },
     subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    estado: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Ventas = mongoose.model('Ventas', ventasSchema);

export default Ventas;
