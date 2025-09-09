import express from "express";
import {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  eliminarPublicacion,
  toggleLike,
  agregarComentario,
  eliminarComentario
} from "../controllers/Publicacion.controller.js";

const router = express.Router();
router.post("/", crearPublicacion);
router.get("/", obtenerPublicaciones);
router.get("/:id", obtenerPublicacionPorId);
router.delete("/:id", eliminarPublicacion);

router.post("/:id/like", toggleLike);


router.post("/:id/comentarios", agregarComentario);
router.delete("/:id/comentarios/:comentarioId", eliminarComentario);

export default router;
