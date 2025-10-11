import express from "express";
import {
  registrarGasto,
  obtenerPresupuestoTotalUsuario,
  obtenerPresupuestoActual,
  cerrarPresupuestoAnterior,
  obtenerPresupuestoDetalladoPorMascota, // ✅ importar
} from "../controllers/Presupuesto.controller.js";

const router = express.Router();

// Crear o agregar gasto
router.post("/", registrarGasto);

// Obtener presupuesto total del usuario
router.get("/usuario/:usuarioId/total", obtenerPresupuestoTotalUsuario);

// Obtener presupuesto actual del usuario
router.get("/usuario/:usuarioId/actual", obtenerPresupuestoActual);

// 🔹 Nueva ruta: presupuesto detallado por mascota
router.get("/mascota/:usuarioId/:mascotaId", obtenerPresupuestoDetalladoPorMascota);

// Cerrar presupuesto anterior
router.put("/cerrar/:usuarioId", cerrarPresupuestoAnterior);

export default router;
