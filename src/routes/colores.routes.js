import { Router } from "express";
import {
  crearColor,
  mostrarColores,
  editarColor,
  eliminarColor,
  obtenerColorPorId
 
} from "../controllers/colores.controller.js";

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";
const router = Router();

// Ruta para obtener todos los colores
router.get("/", mostrarColores);
router.get("/:id", obtenerColorPorId);
// Ruta para crear un nuevo color
router.post("/",  crearColor);

// Ruta para actualizar un color por su ID
router.put("/:id",  editarColor);

// Ruta para eliminar un color por su ID
router.delete("/:id",  eliminarColor);


export default router;