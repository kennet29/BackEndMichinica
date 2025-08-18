import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PerfilSchema = new Schema({
  idNumerico: { type: Number, unique: true },
  bocetos: [{ type: String }],
  productosFinales: [{ type: Schema.Types.ObjectId, ref: "Producto" }],
  descripcionTrabajos: { type: String },
  imagen: { type: String }
});

PerfilSchema.pre("save", async function(next) {
  if (!this.idNumerico) {
    const max = await this.constructor.findOne().sort({ idNumerico: -1 }).select("idNumerico");
    this.idNumerico = max ? max.idNumerico + 1 : 1;
  }
  next();
});

const Perfil = model("Perfil", PerfilSchema);
export default Perfil;
