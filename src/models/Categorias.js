import mongoose from 'mongoose';
// Asegúrate de proporcionar la ruta correcta al archivo de modelo de Artículo

const categoriaSchema = new mongoose.Schema(
  {
    categoria: {
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

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;
