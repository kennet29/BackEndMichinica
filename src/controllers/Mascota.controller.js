import Mascota from "../models/Mascota.js";

// 📌 Crear nueva mascota
export const crearMascota = async (req, res) => {
  try {
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
      return res.status(400).json({ message: "Especie inválida. Opciones: perro, gato, ave, roedor, tortuga, conejo, otro." });
    }

    if (tarjetaVeterinaria === undefined) {
      return res.status(400).json({ message: "Debe indicar si tiene tarjeta veterinaria (true/false)." });
    }

    if (!sexo || !["macho", "hembra"].includes(sexo)) {
      return res.status(400).json({ message: "Sexo inválido. Opciones: macho o hembra." });
    }

    if (!usuarioId) {
      return res.status(400).json({ message: "El usuarioId es obligatorio." });
    }

    // 📷 Manejo de archivos
    let fotoPerfilId = null;
    let fotosIds = [];

    if (req.files && req.files.length > 0) {
      // Primera foto será la de perfil
      fotoPerfilId = req.files[0].id || req.files[0]._id;

      // Todas a la galería
      fotosIds = req.files.map((file) => file.id || file._id);
    }

    const nuevaMascota = new Mascota({
      nombre: nombre.trim(),
      especie,
      tarjetaVeterinaria,
      raza: raza?.trim(),
      cumpleaños: cumpleaños ? new Date(cumpleaños) : null,
      sexo,
      descripcion: descripcion?.trim(),
      usuarioId,
      fotoPerfilId,
      fotosIds,
    });

    await nuevaMascota.save();

    res.status(201).json({
      message: "✅ Mascota registrada correctamente",
      mascota: nuevaMascota,
    });
  } catch (error) {
    console.error("❌ Error al crear mascota:", error);
    res.status(500).json({
      message: "Error al registrar la mascota",
      error: error.message,
    });
  }
};

// 📌 Obtener todas las mascotas de un usuario
export const obtenerMascotas = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ message: "Se requiere el usuarioId." });
    }

    const mascotas = await Mascota.find({ usuarioId });

    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mascotas", error: error.message });
  }
};

// 📌 Obtener mascota por ID
export const obtenerMascotaPorId = async (req, res) => {
  try {
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
    const updates = req.body;

    // 🔹 Validaciones básicas
    if (updates.nombre && updates.nombre.trim().length < 2) {
      return res.status(400).json({ message: "El nombre debe tener al menos 2 caracteres." });
    }

    if (updates.especie && !["perro", "gato", "ave", "roedor", "tortuga", "conejo", "otro"].includes(updates.especie)) {
      return res.status(400).json({ message: "Especie inválida." });
    }

    if (updates.sexo && !["macho", "hembra"].includes(updates.sexo)) {
      return res.status(400).json({ message: "Sexo inválido." });
    }

    // 📷 Si vienen nuevas fotos, reemplazamos
    if (req.files && req.files.length > 0) {
      updates.fotoPerfilId = req.files[0].id || req.files[0]._id;
      updates.fotosIds = req.files.map((file) => file.id || file._id);
    }

    const mascota = await Mascota.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    res.json({ message: "✅ Mascota actualizada", mascota });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar mascota", error: error.message });
  }
};

// 📌 Eliminar mascota
export const eliminarMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findByIdAndDelete(req.params.id);
    if (!mascota) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }
    res.json({ message: "🗑️ Mascota eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar mascota", error: error.message });
  }
};
