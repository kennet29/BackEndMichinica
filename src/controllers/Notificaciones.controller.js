import Notificacion from "../models/Notificaciones.js";

// Obtener todas las notificaciones de un usuario
export const obtenerNotificaciones = async (req, res) => {
  try {
    const notificaciones = await Notificacion.find({ usuarioId: req.params.usuarioId })
      .populate("mascotaId", "nombre")
      .sort({ createdAt: -1 });

    res.status(200).json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notificaciones", error: error.message });
  }
};

// Obtener solo notificaciones pendientes
export const obtenerPendientes = async (req, res) => {
  try {
    const notificaciones = await Notificacion.find({
      usuarioId: req.params.usuarioId,
      leida: false
    }).populate("mascotaId", "nombre");

    res.status(200).json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notificaciones pendientes", error: error.message });
  }
};

// Marcar notificación como leída
export const marcarLeida = async (req, res) => {
  try {
    const notificacion = await Notificacion.findByIdAndUpdate(
      req.params.id,
      { leida: true },
      { new: true }
    );

    if (!notificacion) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    res.status(200).json({ message: "Notificación marcada como leída", notificacion });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar notificación", error: error.message });
  }
};
