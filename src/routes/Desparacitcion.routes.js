import express from "express";
import {
  crearDesparasitacion,
  obtenerDesparasitaciones,
  obtenerDesparasitacionPorId,
  actualizarDesparasitacion,
  eliminarDesparasitacion,
} from "../controllers/desparasitacionController.js";

const router = express.Router();

router.post("/", crearDesparasitacion);
router.get("/", obtenerDesparasitaciones);
router.get("/:id", obtenerDesparasitacionPorId);
router.put("/:id", actualizarDesparasitacion);
router.delete("/:id", eliminarDesparasitacion);

export default router;
