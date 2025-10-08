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
import PresupuestoMascota from "../models/PresupuestoMascota.js";

// ✅ Crear o mantener el presupuesto mensual activo de una mascota
export const inicializarPresupuestoMes = async (req, res) => {
  try {
    const { mascotaId, usuarioId, presupuestoMensual } = req.body;

    const fecha = new Date();
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();

    // Cerrar presupuesto anterior
    const mesAnterior = mes === 0 ? 11 : mes - 1;
    const anioAnterior = mes === 0 ? anio - 1 : anio;

    await PresupuestoMascota.updateMany(
      { mascotaId, mes: mesAnterior, anio: anioAnterior, cerrado: false },
      { $set: { cerrado: true } }
    );

    // Buscar presupuesto actual
    let presupuesto = await PresupuestoMascota.findOne({ mascotaId, mes, anio });
    if (!presupuesto) {
      presupuesto = new PresupuestoMascota({ mascotaId, usuarioId, mes, anio, presupuestoMensual });
      await presupuesto.save();
      return res.status(201).json({ message: "Presupuesto mensual creado", presupuesto });
    }

    return res.status(200).json({ message: "Ya existe presupuesto para este mes", presupuesto });
  } catch (error) {
    res.status(500).json({ message: "Error al inicializar presupuesto mensual", error: error.message });
  }
};

// ✅ Agregar un gasto a la mascota
export const agregarGasto = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const { tipo, descripcion, monto } = req.body;

    const fecha = new Date();
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();

    const presupuesto = await PresupuestoMascota.findOne({ mascotaId, mes, anio });
    if (!presupuesto) return res.status(404).json({ message: "No hay presupuesto activo para este mes" });
    if (presupuesto.cerrado) return res.status(400).json({ message: "Presupuesto cerrado" });

    presupuesto.gastos.push({ tipo, descripcion, monto });
    await presupuesto.save();

    res.status(200).json({ message: "Gasto agregado", presupuesto });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar gasto", error: error.message });
  }
};

// ✅ Obtener presupuesto actual
export const obtenerPresupuestoActual = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const fecha = new Date();
    const mes = fecha.getMonth();
    const anio = fecha.getFullYear();

    const presupuesto = await PresupuestoMascota.findOne({ mascotaId, mes, anio })
      .populate("mascotaId", "nombre especie");

    if (!presupuesto) return res.status(404).json({ message: "No hay presupuesto para este mes" });

    const totalGastado = presupuesto.gastos.reduce((acc, g) => acc + g.monto, 0);
    const restante = presupuesto.presupuestoMensual - totalGastado;

    res.status(200).json({
      presupuesto,
      totalGastado,
      restante,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener presupuesto actual", error: error.message });
  }
};

// ✅ Historial de presupuestos de la mascota
export const obtenerHistorialPresupuestos = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const historial = await PresupuestoMascota.find({ mascotaId }).sort({ anio: -1, mes: -1 });
    res.status(200).json(historial);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial", error: error.message });
  }
};

// ✅ Gasto total acumulado de una mascota
export const obtenerGastoTotalMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const presupuestos = await PresupuestoMascota.find({ mascotaId });

    if (presupuestos.length === 0)
      return res.status(404).json({ message: "No hay presupuestos registrados" });

    const gastoTotal = presupuestos.reduce(
      (acc, p) => acc + p.gastos.reduce((sum, g) => sum + g.monto, 0),
      0
    );

    res.status(200).json({
      mascotaId,
      gastoTotal,
      cantidadPresupuestos: presupuestos.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al calcular gasto total", error: error.message });
  }
};
