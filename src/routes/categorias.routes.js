import { Router } from "express";
import { createCategoria, getCategorias, getCategoriaById, updateCategoria, deleteCategoria } from "../controllers/categorias.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getCategorias);
router.get("/:id", getCategoriaById);
router.post("/", [verifyToken, isModerator], createCategoria);
router.put("/:id", [verifyToken, isModerator], updateCategoria);
router.delete("/:id", [verifyToken, isAdmin], deleteCategoria);

export default router;
