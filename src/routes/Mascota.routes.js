// routes/mascotaRoutes.js
import express from "express";
import {
  crearMascota,
  obtenerMascotas,
  obtenerMascotaPorId,
  actualizarMascota,
  eliminarMascota,
} from "../controllers/mascotaController.js";

const router = express.Router();

router.post("/", crearMascota);
router.get("/", obtenerMascotas);
router.get("/:id", obtenerMascotaPorId);
router.put("/:id", actualizarMascota);
router.delete("/:id", eliminarMascota);

export default router;
