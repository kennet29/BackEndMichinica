import express from "express";
import { upload } from "../database.js"; // ⚡ usa tu mismo multer-gridfs
import {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  eliminarPublicacion,
  toggleLike,
  agregarComentario,
  eliminarComentario,
  obtenerFotoPublicacion, // 👈 nuevo endpoint para mostrar imagen
} from "../controllers/Publicacion.controller.js";

const router = express.Router();

/**
 * 📌 Rutas de Publicaciones
 * Base: /api/publicaciones
 */

// Crear publicación con imágenes
router.post("/", upload.array("imagenes", 5), crearPublicacion);

// Obtener todas las publicaciones
router.get("/", obtenerPublicaciones);

// Obtener una publicación por ID
router.get("/:id", obtenerPublicacionPorId);

// Obtener foto desde GridFS
// ⚠️ importante: antes de "/:id" para evitar conflictos
router.get("/foto/:id", obtenerFotoPublicacion);

// Eliminar publicación
router.delete("/:id", eliminarPublicacion);

// Likes y comentarios
router.post("/:id/like", toggleLike);
router.post("/:id/comentarios", agregarComentario);
router.delete("/:id/comentarios/:comentarioId", eliminarComentario);

export default router;
