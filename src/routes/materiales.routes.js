import { Router } from "express";
import {
  getAllMateriales,
  createNewMaterial,
  deleteMaterialById,
  updateMaterialById,
  
} from "../controllers/materiales.controller.js";

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllMateriales); // Obtener todos los materiales
router.post("/",[verifyToken,isModerator], createNewMaterial); // Crear un nuevo material
router.delete("/:id",[verifyToken,isAdmin], deleteMaterialById); // Eliminar un material por ID
router.put("/:id",[verifyToken,isModerator], updateMaterialById); // Actualizar un material por ID


export default router;