import { Router } from "express";
import { editarConfiguracion, verConfiguraciones, crearConfiguracion } from "../controllers/configuracion.controller.js";

const router = Router();

router.post("/", crearConfiguracion); // Ruta para crear una nueva configuración
router.get("/", verConfiguraciones); // Ruta para ver todas las configuraciones
router.put("/:id", editarConfiguracion); // Ruta para editar la primera configuración

export default router;
