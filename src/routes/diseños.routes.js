import { Router } from "express";
import {
  obtenerDisenos,
  crearDiseno,
  actualizarDiseno,
  eliminarDiseno,
} from "../controllers/diseños.controller.js";

import { verifyToken,isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();


router.get("/", obtenerDisenos);
router.post("/",[verifyToken,isModerator], crearDiseno);
router.put("/:id",[verifyToken,isModerator],  actualizarDiseno);
router.delete("/:id",[verifyToken,isAdmin], eliminarDiseno);
export default router;
