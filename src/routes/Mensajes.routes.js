// routes/mensajeRoutes.js
import express from "express";
import {
  enviarMensaje,
  obtenerConversacion,
  obtenerMensajesRecibidos,
  marcarComoLeido,
  eliminarMensaje,
} from "../controllers/mensajeController.js";

const router = express.Router();

// CRUD básico
router.post("/", enviarMensaje);
router.get("/conversacion/:usuario1/:usuario2", obtenerConversacion);
router.get("/recibidos/:usuarioId", obtenerMensajesRecibidos);
router.put("/:id/leido", marcarComoLeido);
router.delete("/:id", eliminarMensaje);

export default router;
