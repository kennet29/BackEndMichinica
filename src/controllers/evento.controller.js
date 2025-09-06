// controllers/eventoController.js
import Evento from "../models/Evento.js";

// Crear un nuevo evento
export const crearEvento = async (req, res) => {
  try {
    const evento = new Evento(req.body);
    await evento.save();
    res.status(201).json({ message: "Evento creado con éxito", evento });
  } catch (error) {
    res.status(400).json({ message: "Error al crear evento", error: error.message });
  }
};

// Obtener todos los eventos
export const obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find()
      .populate("organizadorId", "username email")
      .populate("participantes", "username email");

    res.status(200).json(eventos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener eventos", error: error.message });
  }
};

// Obtener un evento por ID
export const obtenerEventoPorId = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id)
      .populate("organizadorId", "username email")
      .populate("participantes", "username email");

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json(evento);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener evento", error: error.message });
  }
};

// Actualizar un evento
export const actualizarEvento = async (req, res) => {
  try {
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

// Eliminar un evento
export const eliminarEvento = async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json({ message: "Evento eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar evento", error: error.message });
  }
};

// Unirse a un evento
export const unirseEvento = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    if (evento.participantes.includes(usuarioId)) {
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

    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    evento.participantes = evento.participantes.filter(
      (id) => id.toString() !== usuarioId
    );
    await evento.save();

    res.status(200).json({ message: "Usuario eliminado del evento", evento });
  } catch (error) {
    res.status(400).json({ message: "Error al salir del evento", error: error.message });
  }
};
