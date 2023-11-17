import mongoose from "mongoose";

const mercanciaSchema = new mongoose.Schema(
  {
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Fecha: {
      type: Date,
      required: true,
    },

    id_articulo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Articulo",
      required: true,
    },

    Cantidad: {
      type: Number,
      required: true,
    },
    Danos: {
      type: String,
      required: true,
    },
    Estado: {
      type: Boolean,
      required: true,
    },
    Descripcion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Mercancia", mercanciaSchema);
