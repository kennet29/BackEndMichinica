import express from "express";
import upload from "../middlewares/upload.js";
import {
  crearMascotaPerdida,
  obtenerMascotasPerdidas,
  obtenerMascotaPerdidaPorId,
  actualizarMascotaPerdida,
  eliminarMascotaPerdida,
  obtenerFoto,
} from "../controllers/MascotaPerdida.controller.js";

const router = express.Router();

// 👇 Aquí cambiamos a upload.single para manejar una sola foto
router.post("/", upload.single("fotos"), crearMascotaPerdida);

router.get("/", obtenerMascotasPerdidas);
router.get("/:id", obtenerMascotaPerdidaPorId);
router.put("/:id", upload.single("fotos"), actualizarMascotaPerdida);
router.delete("/:id", eliminarMascotaPerdida);
router.get("/foto/:id", obtenerFoto);

export default router;
