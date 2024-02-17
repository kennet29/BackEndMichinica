import { Router } from "express";
import {
  getAllStock,
  createNewStock,
  updateExistenciasByID,
  updateStockByID // Importa la nueva función
} from "../controllers/stock.controller.js";

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllStock);

router.post("/", createNewStock,[verifyToken,isModerator]);

// Ruta para actualizar solo el campo Existencias
router.put("/:id",[verifyToken,isModerator], updateExistenciasByID);

// Nueva ruta para actualizar todos los campos
router.put("/update/:id",[verifyToken,isModerator], updateStockByID);

export default router;
