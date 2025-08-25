import Evento from "../models/Evento.js";
import mongoose from "mongoose";

// Crear evento con imagen
export const createEvento = async (req, res) => {
  try {
    const nuevoEvento = new Evento({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      fecha: req.body.fecha,
      usuariosInscritos: req.body.usuariosInscritos || [],
      imagen: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype
          }
        : undefined
    });

    await nuevoEvento.save();

    // Convertir imagen a base64 antes de enviar al frontend
    let imagenBase64 = null;
    if (nuevoEvento.imagen && nuevoEvento.imagen.data) {
      imagenBase64 = Buffer.from(nuevoEvento.imagen.data).toString("base64");
    }

    res.status(201).json({ ...nuevoEvento.toObject(), imagenBase64 });
  } catch (error) {
    console.error("Error creando evento:", error);
    res.status(500).json({ error: error.message || "Error al crear evento" });
  }
};

// Obtener todos los eventos
export const getEventos = async (req, res) => {
  try {
    const eventos = await Evento.find().populate("usuariosInscritos");

    // Convertir imágenes a base64
    const eventosConImagenBase64 = eventos.map(evento => {
      let imagenBase64 = null;
      if (evento.imagen && evento.imagen.data) {
        imagenBase64 = Buffer.from(evento.imagen.data).toString("base64");
      }
      return {
        ...evento.toObject(),
        imagenBase64,
        usuariosInscritos: evento.usuariosInscritos || []
      };
    });

    res.status(200).json(eventosConImagenBase64);
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

// Obtener un evento por ID
export const getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id).populate("usuariosInscritos");
    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });

    let imagenBase64 = null;
    if (evento.imagen && evento.imagen.data) {
      imagenBase64 = Buffer.from(evento.imagen.data).toString("base64");
    }

    res.status(200).json({ ...evento.toObject(), imagenBase64, usuariosInscritos: evento.usuariosInscritos || [] });
  } catch (error) {
    console.error("Error obteniendo evento:", error);
    res.status(500).json({ error: error.message || "Error al obtener evento" });
  }
};

// Actualizar evento (con posibilidad de nueva imagen)
export const updateEvento = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imagen = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const evento = await Evento.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate("usuariosInscritos");
    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });

    let imagenBase64 = null;
    if (evento.imagen && evento.imagen.data) {
      imagenBase64 = Buffer.from(evento.imagen.data).toString("base64");
    }

    res.status(200).json({ ...evento.toObject(), imagenBase64, usuariosInscritos: evento.usuariosInscritos || [] });
  } catch (error) {
    console.error("Error actualizando evento:", error);
    res.status(500).json({ error: error.message || "Error al actualizar evento" });
  }
};

// Eliminar evento
export const deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });
    res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando evento:", error);
    res.status(500).json({ error: error.message || "Error al eliminar evento" });
  }
};

// Inscribir usuario en un evento
export const inscribirUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const evento = await Evento.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { usuariosInscritos: usuarioId } }, 
      { new: true }
    ).populate("usuariosInscritos");

    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });

    let imagenBase64 = null;
    if (evento.imagen && evento.imagen.data) {
      imagenBase64 = Buffer.from(evento.imagen.data).toString("base64");
    }

    res.status(200).json({ ...evento.toObject(), imagenBase64, usuariosInscritos: evento.usuariosInscritos || [] });
  } catch (error) {
    console.error("Error inscribiendo usuario:", error);
    res.status(500).json({ error: error.message || "Error al inscribir usuario" });
  }
};
