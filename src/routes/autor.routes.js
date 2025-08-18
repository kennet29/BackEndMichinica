import { Router } from "express";
import { 
  createNewAutor, 
  getAllAutores, 
  updateAutorById, 
  deleteAutorById 
} from "../controllers/autor.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

// Obtener todos los autores (cualquiera puede ver)
router.get("/", getAllAutores);

// Crear un nuevo autor (solo moderadores)
router.post("/", [verifyToken, isModerator], createNewAutor);

// Actualizar un autor por ID (solo moderadores)
router.put("/:id", [verifyToken, isModerator], updateAutorById);

// Eliminar un autor por ID (solo admin)
router.delete("/:id", [verifyToken, isAdmin], deleteAutorById);

export default router;
