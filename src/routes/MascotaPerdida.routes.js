import express from "express";
import {
  crearMascotaPerdida,
  obtenerMascotasPerdidas,
  obtenerMascotaPerdidaPorId,
  actualizarMascotaPerdida,
  eliminarMascotaPerdida,
  obtenerFoto, // 👈 nuevo import
} from "../controllers/MacotaPerdida.controller.js";

const router = express.Router();

// CRUD Mascotas
router.post("/", crearMascotaPerdida);
router.get("/", obtenerMascotasPerdidas);
router.get("/:id", obtenerMascotaPerdidaPorId);
router.put("/:id", actualizarMascotaPerdida);
router.delete("/:id", eliminarMascotaPerdida);

// Endpoint para imágenes de GridFS
router.get("/foto/:id", obtenerFoto); // 👈 aquí se expone la foto

export default router;
