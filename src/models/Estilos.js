import mongoose from "mongoose";
const { Schema, model } = mongoose;

const EstiloSchema = new Schema({
  idNumerico: { type: Number, unique: true },
  estilo: { type: String, required: true },
  descripcion:{type: String, required: true},
  estado:{type:Boolean, required: true}
}, { timestamps: true });

EstiloSchema.pre("save", async function(next) {
  if (!this.idNumerico) {
    const max = await this.constructor.findOne().sort({ idNumerico: -1 }).select("idNumerico");
    this.idNumerico = max ? max.idNumerico + 1 : 1;
  }
  next();
});

const Estilo = model("Estilo", EstiloSchema);
export default Estilo;
