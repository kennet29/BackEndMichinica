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
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();
const upload = multer(); // guarda archivos en memoria

// Obtener todos los eventos
router.get("/", getEventos);

// Obtener un evento por ID
router.get("/:id", getEventoById);

// Crear evento con imagen (solo moderador o admin)
router.post("/", [verifyToken, isModerator], upload.single("imagen"), createEvento);

// Actualizar evento con posibilidad de cambiar imagen
router.put("/:id", [verifyToken, isModerator], upload.single("imagen"), updateEvento);

// Eliminar evento (solo admin)
router.delete("/:id", [verifyToken, isAdmin], deleteEvento);

// Inscribir un usuario en un evento
router.post("/:id/inscribir", [verifyToken], inscribirUsuario);

export default router;
