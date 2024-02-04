import { Router } from "express";
import { createUser,getUsers,getRoleNameById,updateUser } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";


const router = Router();


router.post("/",[verifyToken,isAdmin,checkExistingUser], createUser);
router.put("/:userId",[verifyToken,isAdmin], updateUser);
router.get("/",[verifyToken,isAdmin],getUsers);
router.get("/:id",[verifyToken,isAdmin],getRoleNameById);

export default router;
