import express from "express";
import { upload } from "../database.js"; // ⚡ tu config de multer-gridfs
import {
  crearMascota,
  obtenerMascotas,
  obtenerMascotaPorId,
  actualizarMascota,
  eliminarMascota,
  obtenerFotoMascota, 
} from "../controllers/Mascota.controller.js";

const router = express.Router();

/**
 * 📌 Rutas de Mascotas
 * Base: /api/mascotas
 */

// Crear mascota (sube hasta 5 fotos)
router.post("/", upload.array("fotos", 5), crearMascota);

// Obtener todas las mascotas de un usuario
router.get("/usuario/:usuarioId", obtenerMascotas);

// Obtener foto de mascota por ID desde GridFS
// ⚠️ Debe ir ANTES de /:id para evitar conflicto
router.get("/foto/:id", obtenerFotoMascota);

// Obtener una mascota por ID
router.get("/:id", obtenerMascotaPorId);

// Actualizar mascota (permite reemplazar hasta 5 fotos)
router.put("/:id", upload.array("fotos", 5), actualizarMascota);

// Eliminar mascota
router.delete("/:id", eliminarMascota);

export default router;
