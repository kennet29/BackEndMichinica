import express from "express";
import multer from "multer";
import {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  eliminarPublicacion,
  toggleLike,
  agregarComentario,
  eliminarComentario
} from "../controllers/Publicacion.controller.js";

// 🖼 Configurar multer
const storage = multer.memoryStorage(); // guarda archivos en memoria (no en disco)
const upload = multer({ storage });

// 📦 Usar multer para procesar campos e imágenes
const router = express.Router();
router.post("/", upload.any(), crearPublicacion); // 👈 procesa multipart/form-data

router.get("/", obtenerPublicaciones);
router.get("/:id", obtenerPublicacionPorId);
router.delete("/:id", eliminarPublicacion);
router.post("/:id/like", toggleLike);
router.post("/:id/comentarios", agregarComentario);
router.delete("/:id/comentarios/:comentarioId", eliminarComentario);

export default router;
