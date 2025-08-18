import { Router } from "express";
import { createMaterial, getMateriales, getMaterialById, updateMaterial, deleteMaterial } from "../controllers/material.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getMateriales);
router.get("/:id", getMaterialById);
router.post("/", [verifyToken, isModerator], createMaterial);
router.put("/:id", [verifyToken, isModerator], updateMaterial);
router.delete("/:id", [verifyToken, isAdmin], deleteMaterial);

export default router;
