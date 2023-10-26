import { Router } from "express";
import {
  getUsersPage,
  getAllUsers,
  createNewUser,
  getUserById,
  deleteUserById,
  updateUserById,
} from "../controllers/usuarioscontroller"; // Asegúrate de usar el nombre correcto del controlador de usuarios
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";
const router = Router();

router.get("/usuario", getUsersPage);
router.get("/usuarios", getAllUsers); // Cambia el nombre de la ruta si es necesario
router.post("/usuarios", createNewUser);
router.get("/usuarios/:id", getUserById);
router.delete("/usuarios/:id", deleteUserById);
router.put("/usuarios/:id", updateUserById);

export default router;
