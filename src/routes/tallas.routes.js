import { Router } from "express";
import { crearTalla, obtenerTallas, obtenerTallaPorId, actualizarTalla, eliminarTalla } from "../controllers/tallas.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", obtenerTallas); // todos pueden ver
router.get("/:id", obtenerTallaPorId); // todos pueden ver
router.post("/", [verifyToken, isModerator], crearTalla); // solo moderadores
router.put("/:id", [verifyToken, isModerator], actualizarTalla); // solo moderadores
router.delete("/:id", [verifyToken, isAdmin], eliminarTalla); // solo admin

export default router;
