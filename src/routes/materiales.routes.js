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
router.post("/", createNewMaterial); // Crear un nuevo material
router.delete("/:id", deleteMaterialById); // Eliminar un material por ID
router.put("/:id", updateMaterialById); // Actualizar un material por ID


export default router;