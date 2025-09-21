import MascotaPerdida from "../models/MascotaPerdida.js";
import mongoose from "mongoose";

// Crear publicación de mascota perdida con fotos (GridFS)
export const crearMascotaPerdida = async (req, res) => {
  try {
    const { nombre, especie, raza, descripcion, fechaPerdida, lugarPerdida, usuarioId } = req.body;

    // Validaciones
    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio y debe tener al menos 2 caracteres" });
    }
    if (!especie) {
      return res.status(400).json({ message: "La especie es obligatoria" });
    }
    if (!descripcion || descripcion.length < 10) {
      return res.status(400).json({ message: "La descripción es obligatoria y debe tener al menos 10 caracteres" });
    }
    if (!fechaPerdida || isNaN(Date.parse(fechaPerdida))) {
      return res.status(400).json({ message: "La fecha de pérdida es obligatoria y debe ser válida" });
    }
    if (!lugarPerdida) {
      return res.status(400).json({ message: "El lugar de pérdida es obligatorio" });
    }
    if (!usuarioId || !mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: "El usuarioId es obligatorio y debe ser válido" });
    }

    // Guardar IDs de fotos en GridFS (si se subieron)
    const fotosIds = req.files ? req.files.map(file => file.id) : [];

    const mascotaPerdida = new MascotaPerdida({
      ...req.body,
      fotos: fotosIds,
    });

    await mascotaPerdida.save();

    res.status(201).json({ message: "Publicación creada con éxito", mascotaPerdida });
  } catch (error) {
    res.status(400).json({ message: "Error al crear publicación", error: error.message });
  }
};

// Obtener todas las mascotas perdidas
export const obtenerMascotasPerdidas = async (req, res) => {
  try {
    const mascotas = await MascotaPerdida.find()
      .populate("usuarioId", "username email");
    res.status(200).json(mascotas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error: error.message });
  }
};

// Obtener una publicación por ID
export const obtenerMascotaPerdidaPorId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de publicación no válido" });
    }

    const mascota = await MascotaPerdida.findById(req.params.id)
      .populate("usuarioId", "username email");

    if (!mascota) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.status(200).json(mascota);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicación", error: error.message });
  }
};

// Actualizar publicación
export const actualizarMascotaPerdida = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de publicación no válido" });
    }

    const { nombre, descripcion, fechaPerdida } = req.body;

    // Validaciones opcionales
    if (nombre && nombre.length < 2) {
      return res.status(400).json({ message: "El nombre debe tener al menos 2 caracteres" });
    }
    if (descripcion && descripcion.length < 10) {
      return res.status(400).json({ message: "La descripción debe tener al menos 10 caracteres" });
    }
    if (fechaPerdida && isNaN(Date.parse(fechaPerdida))) {
      return res.status(400).json({ message: "La fecha de pérdida debe ser válida" });
    }

    // Si se subieron nuevas fotos, las añadimos
    const nuevasFotos = req.files ? req.files.map(file => file.id) : [];
    if (nuevasFotos.length > 0) {
      req.body.fotos = nuevasFotos;
    }

    const mascota = await MascotaPerdida.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!mascota) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.status(200).json({ message: "Publicación actualizada con éxito", mascota });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar publicación", error: error.message });
  }
};

// Eliminar publicación
export const eliminarMascotaPerdida = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de publicación no válido" });
    }

    const mascota = await MascotaPerdida.findByIdAndDelete(req.params.id);

    if (!mascota) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.status(200).json({ message: "Publicación eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar publicación", error: error.message });
  }
};



export const obtenerFoto = async (req, res) => {
  try {
    const { id } = req.params;

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads", // 👈 asegúrate que coincide con multer-gridfs-storage
    });

    const _id = new mongoose.Types.ObjectId(id);
    const downloadStream = bucket.openDownloadStream(_id);

    downloadStream.on("error", () => {
      res.status(404).json({ message: "Imagen no encontrada" });
    });

    res.set("Content-Type", "image/jpeg"); // puedes detectar el tipo MIME
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener imagen", error: error.message });
  }
};