import mongoose from "mongoose";
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  Id_articulo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Articulo",
    required: true,
  },
  Id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Id_color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
    required: true,
  },
  Id_marca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Marca",
    required: true,
  },
  Id_talla: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Talla",
    required: true,
  },
  Id_estilo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Estilo",
    required: true,
  },
  Id_material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material",
    required: true,
  },
  Id_diseño: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Diseño",
    required: true,
  },
  Descuento: {
    type: Number,
    required: true
  },
  Descuento_maximo: {
    type: Number,
    required: true
  },
  Id_bodega: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bodega",
    required: true,
  },
  Costo: {
    type: Number,
    required: true
  },
  Precio_venta: {
    type: Number,
    required: true
  },
  Estado: {
    type: Boolean,
    required: true
  },
  Daños: {
    type: Boolean,
    required: true
  },
  Descripcion: {
    type: String,
    required: true
  },
  Id_ingreso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingreso",
    required: true,
  },
  Cod_barra: {
    type: Number,
    required: true
  },
  Id_promocion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promocion",
    required: true,
  },
},
{
  timestamps: true,
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
