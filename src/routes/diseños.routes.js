import { Router } from "express";
import {
  obtenerDisenos,
  crearDiseno,
  actualizarDiseno,
  eliminarDiseno,
} from "../controllers/diseños.controller.js";

import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

// Ruta pública para obtener todos los diseños
router.get("/", obtenerDisenos);

// Ruta pública para obtener un diseño por su ID


// Ruta protegida para crear un nuevo diseño (requiere autenticación de token)
router.post("/", crearDiseno);

// Ruta protegida para actualizar un diseño por su ID (requiere autenticación de token)
router.put("/:id",  actualizarDiseno);

// Ruta protegida para eliminar un diseño por su ID (requiere autenticación de token y rol de administrador)
router.delete("/:id", eliminarDiseno);

export default router;
