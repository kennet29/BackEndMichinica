import { Router } from "express";
import {
  getAllArticulos,
  createNewArticulo,
  updateArticuloById,
  deleteArticuloById,
} from "../controllers/articulos.controller.js"; // Assuming the controller file is named "articuloscontroller.js"
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllArticulos);
router.post("/", createNewArticulo);
router.put("/:id", updateArticuloById);
router.delete("/:id", deleteArticuloById);

export default router;


