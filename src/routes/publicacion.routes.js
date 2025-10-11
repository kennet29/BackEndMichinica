import express from "express";
import { upload } from "../database.js"; // ⚡ usa tu config de multer-gridfs
import {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  eliminarPublicacion,
  toggleLike,
  agregarComentario,
  eliminarComentario,
  obtenerFotoPublicacion, // 👈 endpoint para servir imágenes desde GridFS
} from "../controllers/Publicacion.controller.js";

const router = express.Router();

/**
 * 📌 Rutas de Publicaciones
 * Base: /api/publicaciones
 */

// Crear publicación con imágenes (hasta 5)
router.post("/", upload.array("imagenes", 5), crearPublicacion);

// Obtener todas las publicaciones
router.get("/", obtenerPublicaciones);

// ⚠️ Debe ir ANTES de "/:id" para evitar conflicto con el matcher dinámico
router.get("/foto/:id", obtenerFotoPublicacion);

// Obtener una publicación por ID
router.get("/:id", obtenerPublicacionPorId);

// Eliminar publicación
router.delete("/:id", eliminarPublicacion);

// Likes y comentarios
router.post("/:id/like", toggleLike);

// 👇👇 ¡Esta era la que faltaba!
router.post("/:id/comentarios", agregarComentario);

router.delete("/:id/comentarios/:comentarioId", eliminarComentario);

export default router;
