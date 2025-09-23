import express from "express";
import { upload } from "../database.js"; // ⚡ tu config de multer-gridfs
import {
  crearMascota,
  obtenerMascotas,
  obtenerMascotaPorId,
  actualizarMascota,
  eliminarMascota,
  obtenerFotoMascota, // 🆕 importar el controlador de fotos
} from "../controllers/Mascota.controller.js";

const router = express.Router();

// 📌 Crear mascota (sube hasta 5 fotos)
router.post("/", upload.array("fotos", 5), crearMascota);

// 📌 Obtener todas las mascotas de un usuario
router.get("/usuario/:usuarioId", obtenerMascotas);

// 📌 Obtener una mascota por ID
router.get("/:id", obtenerMascotaPorId);

// 📌 Obtener foto de mascota por ID desde GridFS
router.get("/foto/:id", obtenerFotoMascota);

// 📌 Actualizar mascota (permite reemplazar hasta 5 fotos)
router.put("/:id", upload.array("fotos", 5), actualizarMascota);

// 📌 Eliminar mascota
router.delete("/:id", eliminarMascota);

export default router;
