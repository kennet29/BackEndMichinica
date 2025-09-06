// controllers/mensajeController.js
import Mensaje from "../models/Mensaje.js";

// Enviar un mensaje
export const enviarMensaje = async (req, res) => {
  try {
    const { remitenteId, destinatarioId, mensaje } = req.body;

    const nuevoMensaje = new Mensaje({
      remitenteId,
      destinatarioId,
      mensaje,
    });

    await nuevoMensaje.save();
    res.status(201).json({ message: "Mensaje enviado con éxito", nuevoMensaje });
  } catch (error) {
    res.status(400).json({ message: "Error al enviar mensaje", error: error.message });
  }
};

// Obtener conversación entre dos usuarios
export const obtenerConversacion = async (req, res) => {
  try {
    const { usuario1, usuario2 } = req.params;

    const mensajes = await Mensaje.find({
      $or: [
        { remitenteId: usuario1, destinatarioId: usuario2 },
        { remitenteId: usuario2, destinatarioId: usuario1 },
      ],
    })
      .sort({ fecha: 1 })
      .populate("remitenteId", "username email")
      .populate("destinatarioId", "username email");

    res.status(200).json(mensajes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener conversación", error: error.message });
  }
};

// Obtener mensajes recibidos por un usuario
export const obtenerMensajesRecibidos = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const mensajes = await Mensaje.find({ destinatarioId: usuarioId })
      .sort({ fecha: -1 })
      .populate("remitenteId", "username email");

    res.status(200).json(mensajes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mensajes", error: error.message });
  }
};

// Marcar un mensaje como leído
export const marcarComoLeido = async (req, res) => {
  try {
    const mensaje = await Mensaje.findByIdAndUpdate(
      req.params.id,
      { leido: true },
      { new: true }
    );

    if (!mensaje) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    res.status(200).json({ message: "Mensaje marcado como leído", mensaje });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar mensaje", error: error.message });
  }
};

// Eliminar un mensaje
export const eliminarMensaje = async (req, res) => {
  try {
    const mensaje = await Mensaje.findByIdAndDelete(req.params.id);

    if (!mensaje) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    res.status(200).json({ message: "Mensaje eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar mensaje", error: error.message });
  }
};
