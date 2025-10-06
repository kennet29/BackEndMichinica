import Evento from "../models/Evento.js";
import mongoose from "mongoose";

// Crear un nuevo evento
export const crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fechaInicio, fechaFin, estado, ubicacion, organizadorId } = req.body;

    // Validaciones básicas
    if (!titulo || titulo.length < 3) {
      return res.status(400).json({ message: "El título es obligatorio y debe tener al menos 3 caracteres" });
    }

    if (!descripcion || descripcion.length < 10) {
      return res.status(400).json({ message: "La descripción es obligatoria y debe tener al menos 10 caracteres" });
    }

    if (!fechaInicio || isNaN(Date.parse(fechaInicio)) || !fechaFin || isNaN(Date.parse(fechaFin))) {
      return res.status(400).json({ message: "Las fechas son obligatorias y deben tener un formato válido" });
    }

    if (!ubicacion) {
      return res.status(400).json({ message: "La ubicación es obligatoria" });
    }

    if (!organizadorId || !mongoose.Types.ObjectId.isValid(organizadorId)) {
      return res.status(400).json({ message: "El organizadorId es obligatorio y debe ser válido" });
    }

    // 🚨 Validar duplicado (título + ubicación + fechaInicio)
    const eventoExistente = await Evento.findOne({
      titulo: titulo.trim(),
      ubicacion: ubicacion.trim(),
      fechaInicio: new Date(fechaInicio)
    });

    if (eventoExistente) {
      return res.status(400).json({ message: "Ya existe un evento con ese título, ubicación y fecha de inicio" });
    }

    // Crear nuevo evento
    const evento = new Evento(req.body);
    await evento.save();

    res.status(201).json({ message: "Evento creado con éxito", evento });
  } catch (error) {
    res.status(400).json({ message: "Error al crear evento", error: error.message });
  }
};

// Actualizar un evento
export const actualizarEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fechaInicio, fechaFin, ubicacion } = req.body;

    if (titulo && titulo.length < 3) {
      return res.status(400).json({ message: "El título debe tener al menos 3 caracteres" });
    }

    if (descripcion && descripcion.length < 10) {
      return res.status(400).json({ message: "La descripción debe tener al menos 10 caracteres" });
    }

    if ((fechaInicio && isNaN(Date.parse(fechaInicio))) || (fechaFin && isNaN(Date.parse(fechaFin)))) {
      return res.status(400).json({ message: "Las fechas deben tener un formato válido" });
    }

    const evento = await Evento.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json({ message: "Evento actualizado con éxito", evento });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar evento", error: error.message });
  }
};

// Obtener todos los eventos
export const obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find()
      .populate("organizadorId", "nombre email") // ✅ usa modelo User
      .populate("participantes", "nombre email"); // ✅ usa modelo User

    const eventosConCantidad = eventos.map(e => ({
      ...e.toObject(),
      cantidadParticipantes: e.participantes.length
    }));

    res.status(200).json({ eventos: eventosConCantidad });
  } catch (error) {
    res.status(400).json({ message: "Error al obtener eventos", error: error.message });
  }
};

// Obtener un evento por ID
export const obtenerEventoPorId = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id)
      .populate("organizadorId", "nombre email") // ✅ usa modelo User
      .populate("participantes", "nombre email"); // ✅ usa modelo User

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json({
      evento,
      cantidadParticipantes: evento.participantes.length
    });
  } catch (error) {
    res.status(400).json({ message: "Error al obtener el evento", error: error.message });
  }
};

// Unirse a un evento
export const unirseEvento = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId || !mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: "El usuarioId es obligatorio y debe ser válido" });
    }

    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // ✅ comparación segura con ObjectId
    if (evento.participantes.some(id => id.toString() === usuarioId)) {
      return res.status(400).json({ message: "El usuario ya está inscrito en este evento" });
    }

    evento.participantes.push(usuarioId);
    await evento.save();

    res.status(200).json({ message: "Usuario agregado al evento", evento });
  } catch (error) {
    res.status(400).json({ message: "Error al unirse al evento", error: error.message });
  }
};

// Salir de un evento
export const salirEvento = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId || !mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: "El usuarioId es obligatorio y debe ser válido" });
    }

    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    evento.participantes = evento.participantes.filter(
      id => id.toString() !== usuarioId
    );
    await evento.save();

    res.status(200).json({ message: "Usuario eliminado del evento", evento });
  } catch (error) {
    res.status(400).json({ message: "Error al salir del evento", error: error.message });
  }
};


// Obtener solo eventos activos 
export const obtenerEventosActivos = async (req, res) => {
  try {
    const ahora = new Date();

    const eventos = await Evento.find({
      fechaFin: { $gte: ahora },      // todavía no han terminado
      estado: { $ne: "finalizado" }   // opcional: excluir finalizados manualmente
    })
      .populate("organizadorId", "nombre email")
      .populate("participantes", "nombre email");

    const eventosConCantidad = eventos.map(e => ({
      ...e.toObject(),
      cantidadParticipantes: e.participantes.length
    }));

    res.status(200).json({ eventos: eventosConCantidad });
  } catch (error) {
    res.status(400).json({ message: "Error al obtener eventos activos", error: error.message });
  }
};
