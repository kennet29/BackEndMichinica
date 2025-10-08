import express from "express";
import {
  inicializarPresupuestoMes,
  agregarGasto,
  obtenerPresupuestoActual,
  obtenerHistorialPresupuestos,
  obtenerGastoTotalMascota,
} from "../controllers/PresupuestoMascota.controller.js";

const router = express.Router();

router.post("/", inicializarPresupuestoMes);
router.post("/:mascotaId/gastos", agregarGasto);
router.get("/:mascotaId/actual", obtenerPresupuestoActual);
router.get("/:mascotaId/historial", obtenerHistorialPresupuestos);
router.get("/:mascotaId/total", obtenerGastoTotalMascota);

export default router;
