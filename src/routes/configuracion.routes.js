import { Router } from "express";
import { editarConfiguracion, verConfiguraciones, crearConfiguracion } from "../controllers/configuracion.controller.js";
import { verifyToken,isAdmin } from "../middlewares/authJwt.js"; 
const router = Router();

router.post("/", crearConfiguracion);
router.get("/", verConfiguraciones);
router.put("/:id", editarConfiguracion);

export default router;
