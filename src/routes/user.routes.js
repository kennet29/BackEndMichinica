import { Router } from "express";
import { createUser, getUsers, getRoleNameById, updateUser, getUserNames, getUserRolesById,updatePassword } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";





const router = Router();

router.post("/", [verifyToken, isAdmin, checkExistingUser], createUser);
router.put("/:userId", [verifyToken], updateUser);
router.get("/info", [verifyToken], getUsers);
router.get("/all", getUserNames);
router.get("/:id", [verifyToken], getRoleNameById);

// Nueva ruta para obtener los roles de un usuario por su ID
router.get("/roles/:userId", getUserRolesById);
router.put("/:userId/password", updatePassword);

export default router;
