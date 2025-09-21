import express from "express";
import {
  crearVacuna,
  obtenerVacunasPorMascota,
  obtenerVacunaPorId,
  actualizarVacuna,
  eliminarVacuna,
} from "../controllers/vacuna.controller.js";

const router = express.Router();

// Crear una vacuna
router.post("/", crearVacuna);

// Obtener todas las vacunas de una mascota (por mascotaId)
router.get("/mascota/:mascotaId", obtenerVacunasPorMascota);

// Obtener una vacuna por su ID
router.get("/:id", obtenerVacunaPorId);

// Actualizar una vacuna por su ID
router.put("/:id", actualizarVacuna);

// Eliminar una vacuna por su ID
router.delete("/:id", eliminarVacuna);

export default router;
