import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProductoSchema = new Schema({
  idNumerico: { type: Number, unique: true },
  tallaId: { type: Schema.Types.ObjectId, ref: "Talla", required: true },
  materialId: { type: Schema.Types.ObjectId, ref: "Material", required: true },
  colorId: { type: Schema.Types.ObjectId, ref: "Color", required: true },
  categoriaId: { type: Schema.Types.ObjectId, ref: "Categoria", required: true },
  disenoId: { type: Schema.Types.ObjectId, ref: "Diseno", required: true },
  estiloId: { type: Schema.Types.ObjectId, ref: "Estilo", required: true },
  autorId: { type: Schema.Types.ObjectId, ref: "Autor", required: true },
  precioVenta: { type: Number, required: true },
  costo: { type: Number, required: true },
  comision: { type: Number, required: true }
}, { timestamps: true });

ProductoSchema.pre("save", async function(next) {
  if (!this.idNumerico) {
    const max = await this.constructor.findOne().sort({ idNumerico: -1 }).select("idNumerico");
    this.idNumerico = max ? max.idNumerico + 1 : 1;
  }
  next();
});

const Producto = model("Producto", ProductoSchema);
export default Producto;
