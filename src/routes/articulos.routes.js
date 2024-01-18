import { Router } from "express";
import {
  getAllArticulos,
  createNewArticulo,
  updateArticuloById,
  deleteArticuloById,
  obtenerArticuloPorId
} from "../controllers/articulos.controller.js"; // Assuming the controller file is named "articuloscontroller.js"
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllArticulos);
router.get("/:id",obtenerArticuloPorId);
router.post("/",[verifyToken,isModerator], createNewArticulo);
router.put("/:id",[verifyToken,isModerator], updateArticuloById);
router.delete("/:id",[verifyToken,isAdmin], deleteArticuloById);



export default router;


