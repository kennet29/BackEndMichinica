import express from "express";
import {
  crearMascotaPerdida,
  obtenerMascotasPerdidas,
  obtenerMascotaPerdidaPorId,
  actualizarMascotaPerdida,
  eliminarMascotaPerdida,
} from "../controllers/mascotaPerdidaController.js";

const router = express.Router();

// Crear publicación
router.post("/", crearMascotaPerdida);

// Obtener todas
router.get("/", obtenerMascotasPerdidas);

// Obtener por ID
router.get("/:id", obtenerMascotaPerdidaPorId);

// Actualizar
router.put("/:id", actualizarMascotaPerdida);

// Eliminar
router.delete("/:id", eliminarMascotaPerdida);

export default router;
