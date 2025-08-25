import { Router } from "express";
import multer from "multer";
import {
  createEvento,
  getEventos,
  getEventoById,
  updateEvento,
  deleteEvento,
  inscribirUsuario
} from "../controllers/evento.controller.js";

const router = Router();
const upload = multer(); // guarda archivos en memoria

// Crear evento con imagen
router.post("/", upload.single("imagen"), createEvento);

// Obtener todos los eventos
router.get("/", getEventos);

// Obtener evento por ID
router.get("/:id", getEventoById);

// Actualizar evento con posibilidad de cambiar imagen
router.put("/:id", upload.single("imagen"), updateEvento);

// Eliminar evento
router.delete("/:id", deleteEvento);

// Inscribir usuario en evento
router.post("/:id/inscribir", inscribirUsuario);

export default router;
