import { Router } from "express";
import {
  getAllIngresos,
  createNewIngresos,
  updateIngresoById,
  deleteIngresoByID,
  getIngresoById
} from "../controllers/ingresos.controller.js";

const router = Router();


router.get("/", getAllIngresos);
router.post("/", createNewIngresos);
router.put("/:categoriaId", updateIngresoById);
router.delete("/:categoriaId", deleteIngresoByID);
router.get("/:id",getIngresoById);


export default router;
