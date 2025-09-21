import express from "express";
import {
  crearEnfermedadCronica,
  obtenerEnfermedadesPorMascota,
  obtenerEnfermedadPorId,
  actualizarEnfermedadCronica,
  eliminarEnfermedadCronica,
} from "../controllers/enfermedades.controller.js";

const router = express.Router();

router.post("/", crearEnfermedadCronica);
router.get("/mascota/:mascotaId", obtenerEnfermedadesPorMascota);
router.get("/:id", obtenerEnfermedadPorId);
router.put("/:id", actualizarEnfermedadCronica);
router.delete("/:id", eliminarEnfermedadCronica);

export default router;
