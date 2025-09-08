// routes/eventoRoutes.js
import express from "express";
import {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  unirseEvento,
  salirEvento,
} from "../controllers/Evento.controller.js";

const router = express.Router();

router.post("/", crearEvento);
router.get("/", obtenerEventos);
router.get("/:id", obtenerEventoPorId);
router.put("/:id", actualizarEvento);
router.delete("/:id", eliminarEvento);

// Participantes
router.post("/:id/unirse", unirseEvento);
router.post("/:id/salir", salirEvento);

export default router;
