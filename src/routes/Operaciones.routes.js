import express from "express";
import {
  crearOperacion,
  obtenerOperaciones,
  obtenerOperacionPorId,
  actualizarOperacion,
  eliminarOperacion,
  obtenerOperacionesPorMascota, 
} from "../controllers/Operaciones.controller.js";

const router = express.Router();

router.post("/", crearOperacion);
router.get("/", obtenerOperaciones);
router.get("/mascota/:mascotaId", obtenerOperacionesPorMascota);
router.get("/:id", obtenerOperacionPorId);
router.put("/:id", actualizarOperacion);
router.delete("/:id", eliminarOperacion);

export default router;
