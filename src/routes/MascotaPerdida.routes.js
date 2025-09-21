// src/routes/MascotaPerdida.routes.js
import express from "express";
import { upload } from "../database.js";

import {
  crearMascotaPerdida,
  obtenerMascotasPerdidas,
  obtenerMascotaPerdidaPorId,
  actualizarMascotaPerdida,
  eliminarMascotaPerdida,
  obtenerFoto,
} from "../controllers/MascotaPerdida.controller.js";

const router = express.Router();

// 📌 Crear publicación (sube hasta 5 fotos)
router.post("/", upload.array("fotos", 5), crearMascotaPerdida);

// 📌 Obtener todas
router.get("/", obtenerMascotasPerdidas);

// 📌 Obtener una por ID
router.get("/:id", obtenerMascotaPerdidaPorId);

// 📌 Actualizar publicación
router.put("/:id", upload.array("fotos", 5), actualizarMascotaPerdida);

// 📌 Eliminar publicación
router.delete("/:id", eliminarMascotaPerdida);

// 📌 Obtener foto por ID o filename de GridFS
router.get("/foto/:id", obtenerFoto);

export default router;
