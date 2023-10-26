import { Router } from "express";
import {
  getAllProveedores,
  createNewProveedor,
  getProveedorById,
  deleteProveedorById,
  updateProveedorById,
} from "../controllers/proveedores.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

// Rutas para obtener todos los proveedores
router.get("/", getAllProveedores);

// Ruta para crear un nuevo proveedor
router.post("/", createNewProveedor);

// Ruta para obtener un proveedor por su ID
router.get("/:id", getProveedorById);

// Ruta para eliminar un proveedor por su ID
router.delete("/:id", deleteProveedorById);

// Ruta para actualizar un proveedor por su ID
router.put("/:id", updateProveedorById);

export default router;

