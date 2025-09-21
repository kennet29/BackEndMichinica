import express from "express";
import {
  crearMascotaPerdida,
  obtenerMascotasPerdidas,
  obtenerMascotaPerdidaPorId,
  actualizarMascotaPerdida,
  eliminarMascotaPerdida,
} from "../controllers/MacotaPerdida.controller.js";


const router = express.Router();

router.post("/", crearMascotaPerdida);
router.get("/", obtenerMascotasPerdidas);
router.get("/:id", obtenerMascotaPerdidaPorId);
router.put("/:id", actualizarMascotaPerdida);
router.delete("/:id", eliminarMascotaPerdida);

export default router;
