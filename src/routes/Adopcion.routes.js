// routes/adopcionRoutes.js
import express from "express";
import {
  crearAdopcion,
  obtenerAdopciones,
  obtenerAdopcionPorId,
  actualizarEstadoAdopcion,
  eliminarAdopcion,
} from "../controllers/adopcionController.js";

const router = express.Router();

router.post("/", crearAdopcion);
router.get("/", obtenerAdopciones);
router.get("/:id", obtenerAdopcionPorId);
router.put("/:id", actualizarEstadoAdopcion);
router.delete("/:id", eliminarAdopcion);

export default router;
