import { Router } from "express";
import {
  getAllEstilos,
  createNewEstilo,
  getEstiloById,
  deleteEstiloById,
  getTotalEstilos,
  updateEstiloById
} from "../controllers/estilos.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();


router.get("/", getAllEstilos);


router.post("/",[verifyToken,isModerator],  createNewEstilo);


router.get("/:id", getEstiloById);

router.delete("/:id",[verifyToken,isModerator],  deleteEstiloById);


router.get("/total", getTotalEstilos);


router.put("/:id",[verifyToken,isModerator],  updateEstiloById);

export default router;
