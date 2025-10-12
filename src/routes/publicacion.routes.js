import express from "express";
import { upload } from "../database.js";
import {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerFotoPublicacion,
  agregarComentario,
  toggleLike,
  eliminarPublicacion, // ✅ importar la función
} from "../controllers/Publicacion.controller.js";

const router = express.Router();

// 📤 Crear nueva publicación con hasta 5 imágenes
router.post("/", upload.array("imagenes", 5), crearPublicacion);

// 📜 Obtener todas las publicaciones
router.get("/", obtenerPublicaciones);

// 🖼️ Obtener foto por ID
router.get("/foto/:id", obtenerFotoPublicacion);

// 💬 Agregar comentario
router.post("/:id/comentarios", agregarComentario);

// ❤️ Dar o quitar like
router.post("/:id/like", toggleLike);

// 🗑️ Eliminar publicación
router.delete("/:id", eliminarPublicacion);

export default router;
