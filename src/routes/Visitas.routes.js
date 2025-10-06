// routes/Visita.routes.js
import express from "express";
import {
  crearVisita,
  obtenerVisitas,
  obtenerVisitaPorId,
  actualizarVisita,
  eliminarVisita,
} from "../controllers/visita.controller.js";

const router = express.Router();

/**
 * 📌 Crear una nueva visita médica
 * POST /api/visitas
 */
router.post("/", crearVisita);

/**
 * 📌 Obtener todas las visitas de una mascota específica
 * GET /api/visitas/mascota/:mascotaId
 */
router.get("/mascota/:mascotaId", obtenerVisitas);

/**
 * 📌 Obtener una visita por su ID
 * GET /api/visitas/:id
 */
router.get("/:id", obtenerVisitaPorId);

/**
 * 📌 Actualizar una visita existente
 * PUT /api/visitas/:id
 */
router.put("/:id", actualizarVisita);

/**
 * 📌 Eliminar una visita
 * DELETE /api/visitas/:id
 */
router.delete("/:id", eliminarVisita);

export default router;
