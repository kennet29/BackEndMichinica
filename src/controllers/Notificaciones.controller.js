import Notificacion from "../models/Notificaciones.js";

// 📌 Obtener todas las notificaciones de un usuario
export const obtenerNotificaciones = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ message: "Se requiere el ID del usuario." });
    }

    const notificaciones = await Notificacion.find({ usuarioId })
      .populate("mascotaId", "nombre especie")
      .sort({ createdAt: -1 });

    res.status(200).json(notificaciones);
  } catch (error) {
    console.error("❌ Error al obtener notificaciones:", error);
    res.status(500).json({
      message: "Error al obtener las notificaciones.",
      error: error.message,
    });
  }
};

// 📌 Obtener solo las notificaciones pendientes (no leídas)
export const obtenerPendientes = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ message: "Se requiere el ID del usuario." });
    }

    const pendientes = await Notificacion.find({
      usuarioId,
      leida: false,
    })
      .populate("mascotaId", "nombre especie")
      .sort({ createdAt: -1 });

    res.status(200).json(pendientes);
  } catch (error) {
    console.error("❌ Error al obtener notificaciones pendientes:", error);
    res.status(500).json({
      message: "Error al obtener las notificaciones pendientes.",
      error: error.message,
    });
  }
};

// 📌 Marcar una notificación como leída
export const marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findByIdAndUpdate(
      id,
      { leida: true },
      { new: true }
    );

    if (!notificacion) {
      return res.status(404).json({ message: "Notificación no encontrada." });
    }

    res.status(200).json({
      message: "Notificación marcada como leída.",
      notificacion,
    });
  } catch (error) {
    console.error("❌ Error al marcar notificación como leída:", error);
    res.status(400).json({
      message: "Error al actualizar la notificación.",
      error: error.message,
    });
  }
};

// 📌 Eliminar todas las notificaciones de un usuario (opcional)
export const eliminarTodasPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ message: "Se requiere el ID del usuario." });
    }

    const resultado = await Notificacion.deleteMany({ usuarioId });

    res.status(200).json({
      message: `Se eliminaron ${resultado.deletedCount} notificaciones del usuario.`,
    });
  } catch (error) {
    console.error("❌ Error al eliminar notificaciones:", error);
    res.status(500).json({
      message: "Error al eliminar las notificaciones del usuario.",
      error: error.message,
    });
  }
};

// 📌 Crear notificación manual (por si quieres usarla desde el backend)
export const crearNotificacion = async (req, res) => {
  try {
    const { usuarioId, mascotaId, mensaje } = req.body;

    if (!usuarioId || !mensaje) {
      return res.status(400).json({
        message: "El usuarioId y el mensaje son obligatorios.",
      });
    }

    const notificacion = new Notificacion({
      usuarioId,
      mascotaId,
      mensaje,
    });

    await notificacion.save();

    res.status(201).json({
      message: "Notificación creada con éxito.",
      notificacion,
    });
  } catch (error) {
    console.error("❌ Error al crear notificación:", error);
    res.status(400).json({
      message: "Error al crear la notificación.",
      error: error.message,
    });
  }
};
