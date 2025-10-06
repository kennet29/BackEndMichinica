import express from "express";
import {
  crearEvento,
  obtenerEventos,
  actualizarEvento,
  unirseEvento,
  salirEvento,
  obtenerEventoPorId,
  obtenerEventosActivos,
} from "../controllers/Eventos.controller.js";

const router = express.Router();

router.post("/", crearEvento);
router.get("/", obtenerEventos);
router.get("/activos", obtenerEventosActivos);  // 👈 nueva ruta
router.put("/:id", actualizarEvento);
router.post("/:id/unirse", unirseEvento);
router.post("/:id/salir", salirEvento);
router.get("/:id", obtenerEventoPorId);

export default router;
