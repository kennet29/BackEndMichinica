import { Router } from "express";
import {
  getCategoriaById,
  getAllCategorias,
  updateCategoriaById,
  deleteCategoriaById,
  createCategoria,
} from "../controllers/categorias.controller.js";
import { isAdmin,isModerator,verifyToken } from "../middlewares/authJwt.js";

const router = Router();


router.get("/", getAllCategorias);
router.get("/:categoriaId", getCategoriaById);
router.post("/",[verifyToken,isModerator], createCategoria);
router.put("/:categoriaId",[verifyToken,isModerator], updateCategoriaById);
router.delete("/:categoriaId",[verifyToken,isAdmin], deleteCategoriaById);

export default router;
