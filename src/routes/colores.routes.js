import { Router } from "express";
import {
  crearColor,
  mostrarColores,
  editarColor,
  eliminarColor,
  obtenerColorPorId
 
} from "../controllers/colores.controller.js";

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";
const router = Router();


router.get("/", mostrarColores);
router.get("/:id", obtenerColorPorId);
router.post("/",[verifyToken,isAdmin],  crearColor);
router.put("/:id",[verifyToken,isModerator],  editarColor);
router.delete("/:id",[verifyToken,isAdmin],  eliminarColor);


export default router;