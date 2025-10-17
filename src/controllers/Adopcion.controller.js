import mongoose from "mongoose";
import Adopcion from "../models/Adopcion.js";
import { getGFS } from "../database.js";
import { Readable } from "stream";

// ============================
// 📌 Crear solicitud de adopción con imágenes
// ============================
export const crearAdopcion = async (req, res) => {
  try {
    const {
      nombre,
      especie,
      edad,
      sexo,
      descripcion,
      telefono,
      correo,
      usuarioId,
    } = req.body;

    if (!nombre || !especie || !sexo || !telefono || !usuarioId) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const bucket = getGFS();
    const fotosIds = [];

    // Guardar imágenes si hay
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

    const nuevaAdopcion = new Adopcion({
      nombre,
      especie,
      edad,
      sexo,
      descripcion,
      telefono,
      correo,
      usuarioId,
      fotosIds,
    });

    await nuevaAdopcion.save();
    res.status(201).json({
      message: "✅ Solicitud de adopción creada correctamente",
      adopcion: nuevaAdopcion,
    });
  } catch (error) {
    console.error("❌ Error al crear adopción:", error);
    res.status(500).json({ message: "Error al registrar la adopción" });
  }
};

// ============================
// 📌 Obtener todas las adopciones
// ============================
export const obtenerAdopciones = async (req, res) => {
  try {
    const adopciones = await Adopcion.find().populate("usuarioId", "nombre correo");
    res.json(adopciones || []);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener adopciones" });
  }
};

// ============================
// 📌 Obtener adopciones por usuario
// ============================
export const obtenerAdopcionesPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const adopciones = await Adopcion.find({ usuarioId });
    res.json(adopciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener adopciones del usuario" });
  }
};

// ============================
// 📌 Actualizar estado de adopción (pendiente/aprobada)
// ============================
export const actualizarEstadoAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const adopcion = await Adopcion.findByIdAndUpdate(
      id,
      { estado, fechaRespuesta: Date.now() },
      { new: true }
    );

    if (!adopcion) return res.status(404).json({ message: "Adopción no encontrada" });

    res.json({ message: "✅ Estado actualizado correctamente", adopcion });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar adopción" });
  }
};

// ============================
// 📌 Eliminar adopción
// ============================
export const eliminarAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Adopcion.findByIdAndDelete(id);

    if (!eliminada) return res.status(404).json({ message: "Adopción no encontrada" });

    res.json({ message: "🗑️ Adopción eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar adopción" });
  }
};

// ============================
// 📌 Obtener imagen desde GridFS
// ============================
export const obtenerFotoAdopcion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID de imagen no válido" });

    const bucket = getGFS();
    const _id = new mongoose.Types.ObjectId(id);
    const downloadStream = bucket.openDownloadStream(_id);

    downloadStream.on("error", () => res.status(404).json({ message: "Imagen no encontrada" }));

    res.set("Content-Type", "image/jpeg");
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener imagen" });
  }
};
