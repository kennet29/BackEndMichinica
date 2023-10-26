import { Router } from "express";
import {
  getCategoriaById,
  getAllCategorias,
  updateCategoriaById,
  deleteCategoriaById,
  createCategoria,
} from "../controllers/categorias.controller.js";

const router = Router();

router.get("/:categoriaId", getCategoriaById);
router.get("/", getAllCategorias);
router.post("/", createCategoria);
router.put("/:categoriaId", updateCategoriaById);
router.delete("/:categoriaId", deleteCategoriaById);

export default router;
