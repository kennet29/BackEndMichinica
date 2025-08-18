import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DisenoSchema = new Schema({
  idNumerico: { type: Number, unique: true },
 diseno: { type: String, required: true },
 descripcion:{type: String, required: true},
 estado:{type:String, required:true}
}, { timestamps: true });

DisenoSchema.pre("save", async function(next) {
  if (!this.idNumerico) {
    const max = await this.constructor.findOne().sort({ idNumerico: -1 }).select("idNumerico");
    this.idNumerico = max ? max.idNumerico + 1 : 1;
  }
  next();
});

const Diseno = model("Diseno", DisenoSchema);
export default Diseno;
