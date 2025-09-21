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

// 📌 Subir una sola foto (flujo alterno)
router.post("/upload", upload.single("fotos"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo" });
    }
    console.log("📷 Archivo subido:", req.file);

    res.status(201).json({
      message: "✅ Imagen subida con éxito",
      fileId: req.file.id || req.file._id,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("❌ Error subiendo archivo:", error);
    res.status(500).json({ message: "Error al subir archivo", error: error.message });
  }
});

// 📌 Obtener todas
router.get("/", obtenerMascotasPerdidas);

// 📌 Obtener una por ID
router.get("/:id", obtenerMascotaPerdidaPorId);

// 📌 Actualizar publicación
router.put("/:id", upload.array("fotos", 5), actualizarMascotaPerdida);

// 📌 Eliminar publicación
router.delete("/:id", eliminarMascotaPerdida);

// 📌 Obtener foto por ID de GridFS
router.get("/foto/:id", obtenerFoto);

export default router;
