import mongoose from 'mongoose';
// Asegúrate de proporcionar la ruta correcta al archivo de modelo de Categoría

const articuloSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
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

const Articulo = mongoose.model('Articulo', articuloSchema);

export default Articulo;
