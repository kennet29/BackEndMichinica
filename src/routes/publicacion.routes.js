import express from "express";
import { upload } from "../database.js";
import {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerFotoPublicacion,
  agregarComentario,
  toggleLike,
} from "../controllers/Publicacion.controller.js";

const router = express.Router();

router.post("/", upload.array("imagenes", 5), crearPublicacion);
router.get("/", obtenerPublicaciones);
router.get("/foto/:id", obtenerFotoPublicacion);
router.post("/:id/comentarios", agregarComentario);
router.post("/:id/like", toggleLike);

export default router;
