import { Router } from "express";
import {
  getAllIngresos,
  createNewIngresos,
  updateIngresoById,
  deleteIngresoByID,
  getIngresoById,
  exportIngresosToExcel, 
} from "../controllers/ingresos.controller.js";
import { isAdmin, isModerator, verifyToken } from "../middlewares/authJwt.js";

const router = Router();

// Cambia la ruta a "/reportes" para que coincida con tu solicitud
router.get("/reportes", exportIngresosToExcel);
router.get("/", getAllIngresos);
router.post("/", [verifyToken, isModerator], createNewIngresos);
router.put("/:id", [verifyToken, isModerator], updateIngresoById);
router.delete("/:id", [verifyToken, isAdmin], deleteIngresoByID);

// Deja la ruta con el parámetro dinámico al final
router.get("/:id", getIngresoById);

export default router;
