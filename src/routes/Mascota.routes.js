import express from "express";
import { upload } from "../database.js"; // tu config de multer-gridfs
import {
  crearMascota,
  obtenerMascotas,
  obtenerMascotaPorId,
  actualizarMascota,
  eliminarMascota,
} from "../controllers/Mascota.controller.js";

const router = express.Router();

// 📌 Crear mascota (sube hasta 5 fotos)
router.post("/", upload.array("fotos", 5), crearMascota);

// 📌 Obtener todas las mascotas de un usuario
router.get("/usuario/:usuarioId", obtenerMascotas);

// 📌 Obtener una mascota por ID
router.get("/:id", obtenerMascotaPorId);

// 📌 Actualizar mascota
router.put("/:id", upload.array("fotos", 5), actualizarMascota);

// 📌 Eliminar mascota
router.delete("/:id", eliminarMascota);

export default router;
