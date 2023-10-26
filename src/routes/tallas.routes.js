import { Router } from "express";
import { getAllTallas, createNewTalla,  deleteTallaById, updateTallaById } from "../controllers/tallas.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

// Ruta para obtener todas las tallas
router.get("/", getAllTallas);

// Ruta para crear una nueva talla
router.post("/", createNewTalla);

// Ruta para eliminar una talla por su ID
router.delete("/:id", deleteTallaById);

// Ruta para actualizar una talla por su ID
router.put("/:id", updateTallaById);

export default router;
