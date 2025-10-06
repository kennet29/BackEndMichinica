import express from "express";
import {
  obtenerNotificaciones,
  obtenerPendientes,
  marcarLeida,
} from "../controllers/Notificaciones.controller.js";

const router = express.Router();

// ✅ Obtener todas las notificaciones de un usuario
router.get("/:usuarioId", obtenerNotificaciones);

// ✅ Obtener solo las pendientes (no leídas)
router.get("/:usuarioId/pendientes", obtenerPendientes);

// ✅ Marcar como leída
router.put("/:id/leida", marcarLeida);

export default router;
