import mongoose from 'mongoose';

const ingresosSchema = new mongoose.Schema(
  {
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    id_proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proveedor',
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    iva: {
      type: Number,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Ingresos = mongoose.model('Ingresos', ingresosSchema);

export default Ingresos;
