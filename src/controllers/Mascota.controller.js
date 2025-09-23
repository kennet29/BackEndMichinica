import mongoose from "mongoose";
import Mascota from "../models/Mascota.js";
import { getGFS } from "../database.js";
import { Readable } from "stream";

// 📌 Crear nueva mascota
export const crearMascota = async (req, res) => {
  try {
    console.log("📥 BODY RECIBIDO:", req.body);
    console.log("📷 FILES RECIBIDOS:", req.files);

    const {
      nombre,
      especie,
      tarjetaVeterinaria,
      raza,
      cumpleaños,
      sexo,
      descripcion,
      usuarioId,
    } = req.body;

    // 🔹 Validaciones
    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({ message: "El nombre debe tener al menos 2 caracteres." });
    }
    if (!especie || !["perro", "gato", "ave", "roedor", "tortuga", "conejo", "otro"].includes(especie)) {
      return res.status(400).json({ message: "Especie inválida." });
    }
    if (tarjetaVeterinaria === undefined) {
      return res.status(400).json({ message: "Debe indicar si tiene tarjeta veterinaria (true/false)." });
    }
    if (!sexo || !["macho", "hembra"].includes(sexo)) {
      return res.status(400).json({ message: "Sexo inválido." });
    }
    if (!usuarioId) {
      return res.status(400).json({ message: "El usuarioId es obligatorio." });
    }

    const bucket = getGFS();
    const fotosIds = [];
    let fotoPerfilId = null;

    // 📷 Guardar fotos en GridFS manualmente
    if (req.files && req.files.length > 0) {
      for (const [index, file] of req.files.entries()) {
        const uploadStream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        const readable = new Readable();
        readable.push(file.buffer);
        readable.push(null);
        readable.pipe(uploadStream);

        await new Promise((resolve, reject) => {
          uploadStream.on("finish", () => {
            const id = uploadStream.id.toString();
            fotosIds.push(id);
            if (index === 0) fotoPerfilId = id; // primera = perfil
            resolve();
          });
          uploadStream.on("error", reject);
        });
      }
    }

    const nuevaMascota = new Mascota({
      nombre: nombre.trim(),
      especie,
      tarjetaVeterinaria: tarjetaVeterinaria === "true" || tarjetaVeterinaria === true,
      raza: raza?.trim(),
      cumpleaños: cumpleaños ? new Date(cumpleaños) : null,
      sexo,
      descripcion: descripcion?.trim(),
      usuarioId,
      fotoPerfilId,
      fotosIds,
    });

    await nuevaMascota.save();

    console.log("🎉 Mascota guardada en DB:", nuevaMascota);

    res.status(201).json({ message: "✅ Mascota registrada correctamente", mascota: nuevaMascota });
  } catch (error) {
    console.error("❌ Error al crear mascota:", error);
    res.status(500).json({ message: "Error al registrar la mascota", error: error.message });
  }
};

// 📌 Obtener todas las mascotas de un usuario
export const obtenerMascotas = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    if (!usuarioId) return res.status(400).json({ message: "Se requiere el usuarioId." });

    const mascotas = await Mascota.find({ usuarioId });
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mascotas", error: error.message });
  }
};

// 📌 Obtener mascota por ID
export const obtenerMascotaPorId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "ID no válido" });

    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) return res.status(404).json({ message: "Mascota no encontrada" });

    res.json(mascota);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mascota", error: error.message });
  }
};

// 📌 Actualizar mascota
export const actualizarMascota = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "ID no válido" });

    const updates = req.body;

    if (updates.nombre && updates.nombre.trim().length < 2)
      return res.status(400).json({ message: "El nombre debe tener al menos 2 caracteres." });
    if (updates.especie && !["perro", "gato", "ave", "roedor", "tortuga", "conejo", "otro"].includes(updates.especie))
      return res.status(400).json({ message: "Especie inválida." });
    if (updates.sexo && !["macho", "hembra"].includes(updates.sexo))
      return res.status(400).json({ message: "Sexo inválido." });

    const bucket = getGFS();
    const nuevasFotos = [];

    if (req.files && req.files.length > 0) {
      for (const [index, file] of req.files.entries()) {
        const uploadStream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });

        const readable = new Readable();
        readable.push(file.buffer);
        readable.push(null);
        readable.pipe(uploadStream);

        await new Promise((resolve, reject) => {
          uploadStream.on("finish", () => {
            const id = uploadStream.id.toString();
            nuevasFotos.push(id);
            if (index === 0) updates.fotoPerfilId = id;
            resolve();
          });
          uploadStream.on("error", reject);
        });
      }

      updates.fotosIds = nuevasFotos;
    }

    const mascota = await Mascota.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!mascota) return res.status(404).json({ message: "Mascota no encontrada" });

    res.json({ message: "✅ Mascota actualizada", mascota });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar mascota", error: error.message });
  }
};

// 📌 Eliminar mascota
export const eliminarMascota = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "ID no válido" });

    const mascota = await Mascota.findByIdAndDelete(req.params.id);
    if (!mascota) return res.status(404).json({ message: "Mascota no encontrada" });

    res.json({ message: "🗑️ Mascota eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar mascota", error: error.message });
  }
};

// 📌 Obtener foto desde GridFS
export const obtenerFotoMascota = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID de imagen no válido" });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const _id = new mongoose.Types.ObjectId(id);
    const downloadStream = bucket.openDownloadStream(_id);

    downloadStream.on("error", () =>
      res.status(404).json({ message: "Imagen no encontrada" })
    );

    res.set("Content-Type", "image/jpeg");
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener imagen", error: error.message });
  }
};
