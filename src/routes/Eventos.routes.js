import express from "express";
import {
  crearEvento,
  obtenerEventos,
  actualizarEvento,
  unirseEvento,
  salirEvento,
  obtenerEventoPorId,
} from "../controllers/Eventos.controller.js"; // 👈 asegúrate que el archivo exista exactamente con ese nombre

const router = express.Router();

router.post("/", crearEvento);
router.get("/", obtenerEventos);
router.put("/:id", actualizarEvento);
router.post("/:id/unirse", unirseEvento);
router.post("/:id/salir", salirEvento);
router.get("/:id", obtenerEventoPorId); // quité la "/" extra al final

export default router;
