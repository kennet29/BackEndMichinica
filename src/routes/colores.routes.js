import { Router } from "express";
import { createColor, getColores, getColorById, updateColor, deleteColor } from "../controllers/color.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getColores);
router.get("/:id", getColorById);
router.post("/", [verifyToken, isModerator], createColor);
router.put("/:id", [verifyToken, isModerator], updateColor);
router.delete("/:id", [verifyToken, isAdmin], deleteColor);

export default router;
