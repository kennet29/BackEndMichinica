import express from "express";
import {
  crearDesparasitacion,
  obtenerDesparasitaciones,
  obtenerDesparasitacionPorId,
  actualizarDesparasitacion,
  eliminarDesparasitacion,
  obtenerDesparasitacionesPorMascota
} from "../controllers/Desparcitacion.controller.js";

const router = express.Router();

router.post("/", crearDesparasitacion);
router.get("/", obtenerDesparasitaciones);
router.get("/:id", obtenerDesparasitacionPorId);
router.put("/:id", actualizarDesparasitacion);
router.delete("/:id", eliminarDesparasitacion);

// 👇 nuevo endpoint para consultar por mascota
router.get("/mascota/:mascotaId", obtenerDesparasitacionesPorMascota);

export default router;
