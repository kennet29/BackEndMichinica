import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MaterialSchema = new Schema({
  idNumerico: { type: Number, unique: true },
  nombre: { type: String, required: true }
}, { timestamps: true });

MaterialSchema.pre("save", async function(next) {
  if (!this.idNumerico) {
    const max = await this.constructor.findOne().sort({ idNumerico: -1 }).select("idNumerico");
    this.idNumerico = max ? max.idNumerico + 1 : 1;
  }
  next();
});

const Material = model("Material", MaterialSchema);
export default Material;
