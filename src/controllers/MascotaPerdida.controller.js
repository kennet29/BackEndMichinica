// src/controllers/MascotaPerdida.controller.js
import MascotaPerdida from "../models/MascotaPerdida.js";
import mongoose from "mongoose";

import { getGFS } from "../database.js";
import { Readable } from "stream";

// 📌 Crear publicación
// 📌 Crear publicación
export const crearMascotaPerdida = async (req, res) => {
  try {
    console.log("📥 BODY RECIBIDO:", req.body);
    console.log("📷 FILES RECIBIDOS:", req.files);

    const bucket = getGFS();
    const fotosIds = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadStream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        const readable = new Readable();
        readable.push(file.buffer);
        readable.push(null);
        readable.pipe(uploadStream);

        await new Promise((resolve, reject) => {
          uploadStream.on("finish", () => {
            fotosIds.push(uploadStream.id.toString()); 
            resolve();
          });
          uploadStream.on("error", reject);
        });
      }
    }

    // ⚡ Asegurar que contacto siempre se guarde bien
    const mascotaPerdida = new MascotaPerdida({
      nombre: req.body.nombre,
      especie: req.body.especie,
      raza: req.body.raza,
      sexo: req.body.sexo,
      descripcion: req.body.descripcion,
      fotos: fotosIds,
      fechaPerdida: req.body.fechaPerdida,
      lugarPerdida: req.body.lugarPerdida,
      contacto: {
        telefono: req.body.telefono, // 👈 siempre lo metemos dentro de contacto
        email: req.body.email,       // 👈 lo mismo aquí
      },
      estado: req.body.estado,
      usuarioId: req.body.usuarioId,
    });

    await mascotaPerdida.save();

    res.status(201).json({ 
      message: "✅ Publicación creada con éxito", 
      mascotaPerdida 
    });
  } catch (error) {
    console.error("❌ ERROR CREAR MASCOTA:", error);
    res.status(500).json({ 
      message: "Error al crear publicación", 
      error: error.message 
    });
  }
};


// 📌 Obtener todas
export const obtenerMascotasPerdidas = async (req, res) => {
  try {
    const mascotas = await MascotaPerdida.find().populate("usuarioId", "username email");
    res.status(200).json(mascotas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error: error.message });
  }
};

// 📌 Obtener por ID
export const obtenerMascotaPerdidaPorId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "ID no válido" });

    const mascota = await MascotaPerdida.findById(req.params.id).populate(
      "usuarioId",
      "username email"
    );
    if (!mascota) return res.status(404).json({ message: "Publicación no encontrada" });

    res.status(200).json(mascota);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicación", error: error.message });
  }
};

// 📌 Actualizar
export const actualizarMascotaPerdida = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "ID no válido" });

    const { nombre, descripcion, fechaPerdida } = req.body;

    if (nombre && nombre.trim().length < 2)
      return res.status(400).json({ message: "El nombre debe tener al menos 2 caracteres" });
    if (descripcion && descripcion.trim().length < 10)
      return res.status(400).json({ message: "La descripción debe tener al menos 10 caracteres" });
    if (fechaPerdida && isNaN(Date.parse(fechaPerdida)))
      return res.status(400).json({ message: "La fecha de pérdida no es válida" });

    const nuevasFotos = req.files
      ? req.files.map((file) =>
          file.id?.toString() ||
          file._id?.toString() ||
          file.filename
        )
      : [];
    if (nuevasFotos.length > 0) req.body.fotos = nuevasFotos;

    const mascota = await MascotaPerdida.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mascota) return res.status(404).json({ message: "Publicación no encontrada" });

    res.status(200).json({ message: "✅ Publicación actualizada con éxito", mascota });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar publicación", error: error.message });
  }
};

// 📌 Eliminar
export const eliminarMascotaPerdida = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "ID no válido" });

    const mascota = await MascotaPerdida.findByIdAndDelete(req.params.id);
    if (!mascota) return res.status(404).json({ message: "Publicación no encontrada" });

    res.status(200).json({ message: "✅ Publicación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar publicación", error: error.message });
  }
};

// 📌 Obtener foto desde GridFS
export const obtenerFoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID de imagen no válido" });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    const _id = new mongoose.Types.ObjectId(id);
    const downloadStream = bucket.openDownloadStream(_id);

    downloadStream.on("error", () => res.status(404).json({ message: "Imagen no encontrada" }));

    res.set("Content-Type", "image/jpeg");
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener imagen", error: error.message });
  }
};
