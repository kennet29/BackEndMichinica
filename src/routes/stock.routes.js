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

router.post("/", createNewStock);

// Ruta para actualizar solo el campo Existencias
router.put("/:id", updateExistenciasByID);

// Nueva ruta para actualizar todos los campos
router.put("/update/:id", updateStockByID);

export default router;
