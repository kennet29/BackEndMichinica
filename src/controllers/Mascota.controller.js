// controllers/adopcionController.js
import Adopcion from "../models/Adopcion.js";
import Mascota from "../models/Mascota.js";

// Crear una nueva solicitud de adopción
export const crearAdopcion = async (req, res) => {
  try {
    const { mascotaId, usuarioSolicitanteId, usuarioRefugioId } = req.body;

    // Validar que la mascota exista y esté disponible
    const mascota = await Mascota.findById(mascotaId);
    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }
    if (mascota.estadoAdopcion !== "disponible") {
      return res.status(400).json({ message: "La mascota no está disponible para adopción" });
    }

    const adopcion = new Adopcion({
      mascotaId,
      usuarioSolicitanteId,
      usuarioRefugioId,
    });

    await adopcion.save();
    res.status(201).json({ message: "Solicitud de adopción creada con éxito", adopcion });
  } catch (error) {
    res.status(400).json({ message: "Error al crear la adopción", error: error.message });
  }
};

// Obtener todas las solicitudes de adopción
export const obtenerAdopciones = async (req, res) => {
  try {
    const adopciones = await Adopcion.find()
      .populate("mascotaId", "nombre especie raza")
      .populate("usuarioSolicitanteId", "username email")
      .populate("usuarioRefugioId", "username email");

    res.status(200).json(adopciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener adopciones", error: error.message });
  }
};

// Obtener una solicitud por ID
export const obtenerAdopcionPorId = async (req, res) => {
  try {
    const adopcion = await Adopcion.findById(req.params.id)
      .populate("mascotaId", "nombre especie raza")
      .populate("usuarioSolicitanteId", "username email")
      .populate("usuarioRefugioId", "username email");

    if (!adopcion) {
      return res.status(404).json({ message: "Solicitud de adopción no encontrada" });
    }

    res.status(200).json(adopcion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener adopción", error: error.message });
  }
};

// Actualizar estado de adopción (aprobada o rechazada)
export const actualizarEstadoAdopcion = async (req, res) => {
  try {
    const { estado } = req.body;
    if (!["aprobada", "rechazada"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const adopcion = await Adopcion.findById(req.params.id).populate("mascotaId");
    if (!adopcion) {
      return res.status(404).json({ message: "Solicitud de adopción no encontrada" });
    }

    adopcion.estado = estado;
    adopcion.fechaRespuesta = new Date();

    // Si se aprueba, cambiar el estado de la mascota
    if (estado === "aprobada") {
      adopcion.mascotaId.estadoAdopcion = "adoptado";
      await adopcion.mascotaId.save();
    }

    await adopcion.save();

    res.status(200).json({ message: "Estado de adopción actualizado", adopcion });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar adopción", error: error.message });
  }
};

// Eliminar solicitud de adopción
export const eliminarAdopcion = async (req, res) => {
  try {
    const adopcion = await Adopcion.findByIdAndDelete(req.params.id);
    if (!adopcion) {
      return res.status(404).json({ message: "Solicitud de adopción no encontrada" });
    }

    res.status(200).json({ message: "Solicitud de adopción eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar adopción", error: error.message });
  }
};
