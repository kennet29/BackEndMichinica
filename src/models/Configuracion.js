import mongoose from "mongoose";

const configuracionSchema = new mongoose.Schema(
  {
    nombre_negocio: {
      type: String,
      required: true,
      trim: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    correo_electronico: {
      type: String,
      required: true,
    },
    telefono_1: {
      type: Number,
      required: true,
    },
    telefono_2: {
      type: Number,
      required: true,
    },
    eslogan: {
      type: String,
      required: true,
    },
    tipo_de_cambio_dolar: {
      type: Number,
      required: true,
    },
  },
 
);

export default mongoose.model("Configuracion", configuracionSchema);

