import express from "express";
import {
  obtenerNotificaciones,
  obtenerPendientes,
  marcarLeida
} from "../controllers/Notificaciones.controller.js";

const router = express.Router();

router.get("/:usuarioId", obtenerNotificaciones);       // todas
router.get("/:usuarioId/pendientes", obtenerPendientes); // solo las pendientes
router.put("/:id/leida", marcarLeida);                  // marcar como leída

export default router;
