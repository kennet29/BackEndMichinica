import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AutorSchema = new Schema(
  {
    idNumerico: { type: Number, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 🔗 Relación con usuario
    nombreArtistico: { type: String },
    estado:{type:Boolean, required:true},
    descripcionPersonal: { type: String },
  },
  { timestamps: true }
);

// 🔢 Generar idNumerico autoincremental
AutorSchema.pre("save", async function (next) {
  if (!this.idNumerico) {
    const max = await this.constructor
      .findOne()
      .sort({ idNumerico: -1 })
      .select("idNumerico");
    this.idNumerico = max ? max.idNumerico + 1 : 1;
  }
  next();
});

// 🔎 Validar que el userId exista antes de guardar
AutorSchema.pre("save", async function (next) {
  const User = mongoose.model("User");
  const userExists = await User.findById(this.userId);
  if (!userExists) {
    throw new Error("El Usuario asociado no existe. Primero debes crear un Usuario.");
  }
  next();
});

const Autor = model("Autor", AutorSchema);
export default Autor;
