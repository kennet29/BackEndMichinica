import mongoose from "mongoose";
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  Id_articulo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Articulo",
    required: true,
  },
  Id_categoria:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
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
  },  
  Precio_prov: {
    type: Number,
    required: true
  },
  Precio_venta: {
    type: Number,
    required: true
  },
  Existencias:{
type: Number,
required:true
  },
  Estado: {
    type: Boolean,
    
  },
  Daños: {
    type: Boolean,
   
  },
  Descripcion: {
    type: String,
    
  },
  Id_ingreso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingreso",
    required: true,
  },
  Cod_barra: {
    type: Number,
    
  },
  Id_promocion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promocion",
  },
},
{
  timestamps: true,
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
