import { Router } from "express";
import {
  getAllEstilos,
  createNewEstilo,
  getEstiloById,
  deleteEstiloById,
  getTotalEstilos,
  updateEstiloById
} from "../controllers/estilos.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

// Rutas para obtener todos los estilos
router.get("/", getAllEstilos);

// Ruta para crear un nuevo estilo
router.post("/",  createNewEstilo);

// Ruta para obtener un estilo por su ID
router.get("/:id", getEstiloById);

// Ruta para eliminar un estilo por su ID
router.delete("/:id",  deleteEstiloById);

// Ruta para obtener el número total de estilos
router.get("/total", getTotalEstilos);

// Ruta para actualizar un estilo por su ID
router.put("/:id",  updateEstiloById);

export default router;
