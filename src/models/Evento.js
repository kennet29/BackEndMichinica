import mongoose from "mongoose";
const { Schema, model } = mongoose;

const EventoSchema = new Schema({
  idNumerico: { type: Number, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  fecha: { type: Date, required: true },
  imagen: { 
    data: Buffer,       // aquí se guarda el archivo en binario
    contentType: String // el tipo de archivo, ej: "image/png"
  },
  usuariosInscritos: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }]


});

EventoSchema.pre("save", async function(next) {
  if (!this.idNumerico) {
    const max = await this.constructor
      .findOne()
      .sort({ idNumerico: -1 })
      .select("idNumerico");
    this.idNumerico = max ? max.idNumerico + 1 : 1;
  }
  next();
});

const Evento = model("Evento", EventoSchema);
export default Evento;
