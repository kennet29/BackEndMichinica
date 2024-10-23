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

router.get("/reporte", exportIngresosToExcel);
router.get("/", getAllIngresos);
router.post("/", [verifyToken, isModerator], createNewIngresos);
router.put("/:id", [verifyToken, isModerator], updateIngresoById);
router.delete("/:id", [verifyToken, isAdmin], deleteIngresoByID);
router.get("/:id", getIngresoById);

export default router;
