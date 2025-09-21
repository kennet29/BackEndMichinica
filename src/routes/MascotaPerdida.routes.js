// src/routes/MascotaPerdida.routes.js
import express from "express";
import upload from "../database.js";
import {
  crearMascotaPerdida,
  obtenerMascotasPerdidas,
  obtenerMascotaPerdidaPorId,
  actualizarMascotaPerdida,
  eliminarMascotaPerdida,
  obtenerFoto,
} from "../controllers/MascotaPerdida.controller.js";

const router = express.Router();

// 👇 Aquí subes varias fotos con el campo "fotos"
router.post("/", upload.array("fotos", 5), crearMascotaPerdida);
router.get("/", obtenerMascotasPerdidas);
router.get("/:id", obtenerMascotaPerdidaPorId);
router.put("/:id", upload.array("fotos", 5), actualizarMascotaPerdida);
router.delete("/:id", eliminarMascotaPerdida);

// Ruta para ver fotos
router.get("/foto/:id", obtenerFoto);

export default router;
