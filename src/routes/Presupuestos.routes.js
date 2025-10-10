import express from "express";
import {
  registrarGasto,
  obtenerPresupuestoTotalUsuario,
  obtenerPresupuestoActual,
  cerrarPresupuestoAnterior,
} from "../controllers/Presupuesto.controller.js";

const router = express.Router();

// Registrar un nuevo gasto
router.post("/gasto", registrarGasto);

// Obtener presupuesto total del usuario (todas las mascotas)
router.get("/usuario/:usuarioId/total", obtenerPresupuestoTotalUsuario);

// Obtener presupuesto del mes actual
router.get("/usuario/:usuarioId/actual", obtenerPresupuestoActual);

// Cerrar presupuesto del mes anterior
router.put("/usuario/:usuarioId/cerrar", cerrarPresupuestoAnterior);

export default router;
