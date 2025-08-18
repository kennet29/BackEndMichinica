import { Router } from "express";
import { createDiseno, getDisenos, getDisenoById, updateDiseno, deleteDiseno } from "../controllers/diseños.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getDisenos);
router.get("/:id", getDisenoById);
router.post("/", [verifyToken, isModerator], createDiseno);
router.put("/:id", [verifyToken, isModerator], updateDiseno);
router.delete("/:id", [verifyToken, isAdmin], deleteDiseno);

export default router;
