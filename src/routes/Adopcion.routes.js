import express from "express";
import multer from "multer";
import {
  crearAdopcion,
  obtenerAdopciones,
  obtenerAdopcionesPorUsuario,
  actualizarEstadoAdopcion,
  eliminarAdopcion,
  obtenerFotoAdopcion,
} from "../controllers/Adopcion.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Crear nueva adopción con imágenes
router.post("/", upload.array("fotos"), crearAdopcion);

// Obtener todas las adopciones
router.get("/", obtenerAdopciones);

// Obtener adopciones por usuario
router.get("/usuario/:usuarioId", obtenerAdopcionesPorUsuario);

// Actualizar estado (pendiente/aprobada)
router.put("/:id", actualizarEstadoAdopcion);

// Eliminar adopción
router.delete("/:id", eliminarAdopcion);

// Obtener imagen
router.get("/imagen/:id", obtenerFotoAdopcion);

export default router;
