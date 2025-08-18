import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TallaSchema = new Schema({
  idNumerico: { type: Number, unique: true },
  descripcion:{type:Number, required:true},
  estado:{type:Number,required:true},
  nombre: { type: String, required: true }
}, { timestamps: true });

TallaSchema.pre("save", async function(next) {
  if (!this.idNumerico) {
    const max = await this.constructor.findOne().sort({ idNumerico: -1 }).select("idNumerico");
    this.idNumerico = max ? max.idNumerico + 1 : 1;
  }
  next();
});

const Talla = model("Talla", TallaSchema);
export default Talla;
