import Presupuesto from "../models/Presupuesto.js";
import Gasto from "../models/Gasto.js";

// 🟢 Crear o agregar gasto al presupuesto del mes actual
export const registrarGasto = async (req, res) => {
  try {
    const { usuarioId, mascotaId, tipo, descripcion, monto } = req.body;
    if (!usuarioId || !mascotaId || !tipo || !monto) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const fecha = new Date();
    const mesActual = fecha.getMonth();
    const anioActual = fecha.getFullYear();

    // Buscar presupuesto activo del mes
    let presupuesto = await Presupuesto.findOne({
      usuarioId,
      mes: mesActual,
      anio: anioActual,
    });

    // Si no existe, crear uno nuevo
    if (!presupuesto) {
      presupuesto = new Presupuesto({
        usuarioId,
        mes: mesActual,
        anio: anioActual,
        totalGastos: 0,
        cerrado: false,
      });
      await presupuesto.save();
    }

    // Registrar el gasto
    const nuevoGasto = new Gasto({
      usuarioId,
      mascotaId,
      tipo,
      descripcion,
      monto,
    });
    await nuevoGasto.save();

    // Asociarlo al presupuesto
    presupuesto.gastos.push(nuevoGasto._id);
    presupuesto.totalGastos += monto;
    await presupuesto.save();

    res.status(201).json({
      message: "Gasto registrado correctamente",
      gasto: nuevoGasto,
      presupuesto,
    });
  } catch (error) {
    console.error("Error al registrar gasto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🟡 Obtener el presupuesto total por usuario (para vista principal)
export const obtenerPresupuestoTotalUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const presupuestos = await Presupuesto.find({ usuarioId }).populate("gastos");

    if (!presupuestos.length) {
      return res.status(200).json({
        gastoTotalUsuario: 0,
        gastoPorMascota: {},
      });
    }

    let gastoTotalUsuario = 0;
    const gastoPorMascota = {};

    presupuestos.forEach((presupuesto) => {
      presupuesto.gastos.forEach((g) => {
        gastoTotalUsuario += g.monto;
        if (!gastoPorMascota[g.mascotaId]) gastoPorMascota[g.mascotaId] = 0;
        gastoPorMascota[g.mascotaId] += g.monto;
      });
    });

    res.status(200).json({ gastoTotalUsuario, gastoPorMascota });
  } catch (error) {
    console.error("Error al obtener presupuesto total:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔵 Obtener presupuesto actual del usuario (solo mes vigente)
export const obtenerPresupuestoActual = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const fecha = new Date();
    const mesActual = fecha.getMonth();
    const anioActual = fecha.getFullYear();

    const presupuesto = await Presupuesto.findOne({
      usuarioId,
      mes: mesActual,
      anio: anioActual,
    }).populate("gastos");

    if (!presupuesto) {
      return res.status(200).json({
        message: "No hay presupuesto activo para este mes",
        presupuesto: null,
      });
    }

    res.status(200).json(presupuesto);
  } catch (error) {
    console.error("Error al obtener presupuesto actual:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔴 Cerrar presupuesto del mes anterior
export const cerrarPresupuestoAnterior = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const fecha = new Date();
    let mesAnterior = fecha.getMonth() - 1;
    let anio = fecha.getFullYear();
    if (mesAnterior < 0) {
      mesAnterior = 11;
      anio -= 1;
    }

    const presupuesto = await Presupuesto.findOne({
      usuarioId,
      mes: mesAnterior,
      anio,
    });

    if (!presupuesto) {
      return res.status(404).json({ message: "No se encontró presupuesto anterior" });
    }

    presupuesto.cerrado = true;
    await presupuesto.save();

    res.status(200).json({ message: "Presupuesto cerrado correctamente" });
  } catch (error) {
    console.error("Error al cerrar presupuesto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
