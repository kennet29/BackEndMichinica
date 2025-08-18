import { Router } from "express";
import { createEstilo, getEstilos, getEstiloById, updateEstilo, deleteEstilo } from "../controllers/estilos.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getEstilos);
router.get("/:id", getEstiloById);
router.post("/", [verifyToken, isModerator], createEstilo);
router.put("/:id", [verifyToken, isModerator], updateEstilo);
router.delete("/:id", [verifyToken, isAdmin], deleteEstilo);

export default router;
