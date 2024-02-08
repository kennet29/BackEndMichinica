import mongoose from "mongoose";

const mercanciaSchema = new mongoose.Schema(
  {
    id_stock:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Stock",
      required:true,
    },
    id_articulo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Articulo",
      required: true,
    },
    id_usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Fecha: {
      type: Date,
      required: true,
    },

    id_categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Articulo",
      required: true,
    },
    
    id_marca: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Marca",
      required: true,
    },
    
    id_talla: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Talla",
      required: true,
    },
    id_color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    id_ingreso:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Ingresos"
    },
   

    Cantidad: {
      type: Number,
      required: true,
    },
    Daños: {
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
