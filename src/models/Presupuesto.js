// models/Presupuesto.js
import mongoose from "mongoose";

const PresupuestoSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    mes: {
      type: Number,
      required: true, // 0 = Enero, 11 = Diciembre
    },
    anio: {
      type: Number,
      required: true,
    },
    totalGastos: {
      type: Number,
      default: 0,
    },
    cerrado: {
      type: Boolean,
      default: false,
    },
    gastos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gasto",
      },
    ],
  },
  { timestamps: true }
);

// 🔁 Cerrar presupuesto anterior automáticamente al crear uno nuevo
PresupuestoSchema.pre("save", async function (next) {
  if (this.isNew) {
    const existe = await mongoose.model("Presupuesto").findOne({
      usuarioId: this.usuarioId,
      mes: this.mes,
      anio: this.anio,
    });
    if (existe) {
      throw new Error("Ya existe un presupuesto para este mes");
    }
  }
  next();
});

export default mongoose.model("Presupuesto", PresupuestoSchema);
