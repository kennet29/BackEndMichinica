import { Router } from "express";
import {
  getAllDetIngresos,
  createNewDetIngresos,
  updateDetIngresoById,
  deleteDetIngresoByID,
  printDetalleIngresos

} from "../controllers/detalleIngresos.controller.js";

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

// Ruta para obtener todos los detalles de ingresos
router.get("/:id/print",printDetalleIngresos)
router.get("/",  getAllDetIngresos);

// Ruta para crear un nuevo detalle de ingresos
router.post("/",  createNewDetIngresos);

// Ruta para actualizar un detalle de ingresos por su ID
router.put("/:id",  updateDetIngresoById);

// Ruta para eliminar un detalle de ingresos por su ID
router.delete("/:id",  deleteDetIngresoByID);


export default router;
