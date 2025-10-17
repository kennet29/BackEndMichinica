import express from "express";
import {
  registrarVeterinario,
  obtenerVeterinarios,
  obtenerVeterinarioPorId,
  eliminarVeterinario,
} from "../controllers/RegistroVeterinario.controller.js";

const router = express.Router();

// Crear nuevo veterinario
router.post("/", registrarVeterinario);

// Obtener todos los veterinarios
router.get("/", obtenerVeterinarios);

// Obtener veterinario por ID
router.get("/:id", obtenerVeterinarioPorId);

// Eliminar veterinario
router.delete("/:id", eliminarVeterinario);

export default router;
