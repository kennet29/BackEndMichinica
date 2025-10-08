import PresupuestoMascota from "../models/PresupuestoMascota.js";

// ✅ Gasto total de todas las mascotas de un usuario
export const obtenerGastoTotalUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const presupuestos = await PresupuestoMascota.find({ usuarioId }).populate("mascotaId", "nombre especie");

    if (presupuestos.length === 0)
      return res.status(404).json({ message: "No hay presupuestos para este usuario" });

    const gastoPorMascota = {};
    let gastoTotalUsuario = 0;

    presupuestos.forEach((p) => {
      const totalMascota = p.gastos.reduce((sum, g) => sum + g.monto, 0);
      gastoTotalUsuario += totalMascota;

      const id = p.mascotaId._id.toString();
      gastoPorMascota[id] = (gastoPorMascota[id] || 0) + totalMascota;
    });

    res.status(200).json({
      usuarioId,
      gastoTotalUsuario,
      gastoPorMascota,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al calcular gasto total del usuario", error: error.message });
  }
};
