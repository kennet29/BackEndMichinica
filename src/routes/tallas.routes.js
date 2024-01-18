import { Router } from "express";
import { getAllTallas, createNewTalla,  deleteTallaById, updateTallaById } from "../controllers/tallas.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllTallas);
router.post("/",[verifyToken,isModerator], createNewTalla);
router.delete("/:id",[verifyToken,isAdmin], deleteTallaById);
router.put("/:id",[verifyToken,isModerator], updateTallaById);

export default router;
