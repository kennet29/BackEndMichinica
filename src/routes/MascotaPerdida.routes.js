// routes/MascotaPerdida.routes.js
import express from "express";
import multer from "multer";
import {
  crearMascotaPerdida,
  obtenerMascotasPerdidas,
  obtenerMascotaPerdidaPorId,
  actualizarMascotaPerdida,
  eliminarMascotaPerdida,
  obtenerFoto,
} from "../controllers/MascotaPerdida.controller.js";

const router = express.Router();

// Configurar multer (usa GridFS si lo prefieres)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 👇 aquí el cambio: usa upload.any() para aceptar texto + archivos
router.post("/", upload.any(), crearMascotaPerdida);
router.get("/", obtenerMascotasPerdidas);
router.get("/:id", obtenerMascotaPerdidaPorId);
router.put("/:id", upload.any(), actualizarMascotaPerdida);
router.delete("/:id", eliminarMascotaPerdida);
router.get("/foto/:id", obtenerFoto);

export default router;
