// routes/eventoRoutes.js
import express from "express";
import {
  crearEvento,
  obtenerEventos,
  actualizarEvento,
  unirseEvento,
  salirEvento,
} from "../controllers/Evento.controller.js";

const router = express.Router();

router.post("/", crearEvento);
router.get("/", obtenerEventos);
router.put("/:id", actualizarEvento);
router.post("/:id/unirse", unirseEvento);
router.post("/:id/salir", salirEvento);

export default router;
