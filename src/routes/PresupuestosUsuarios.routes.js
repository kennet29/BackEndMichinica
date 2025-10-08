import express from "express";
import { obtenerGastoTotalUsuario } from "../controllers/presupuestoUsuario.controller.js";

const router = express.Router();

router.get("/:usuarioId/total", obtenerGastoTotalUsuario);

export default router;
