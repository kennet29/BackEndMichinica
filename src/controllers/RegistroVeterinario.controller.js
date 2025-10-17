import Veterinario from "../models/RegistroVeterinario.js";

// 🟢 Registrar veterinario
export const registrarVeterinario = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      cedulaNumero,
      nivel,
      codigoIPSA,
      correo,
      telefono,
      tituloFoto,
      cedulaFoto,
    } = req.body;

    if (
      !nombres ||
      !apellidos ||
      !cedulaNumero ||
      !nivel ||
      !codigoIPSA ||
      !correo ||
      !telefono
    ) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const existe = await Veterinario.findOne({
      $or: [{ cedulaNumero }, { codigoIPSA }, { correo }],
    });
    if (existe) {
      return res.status(400).json({ message: "El veterinario ya está registrado." });
    }

    const nuevoVeterinario = new Veterinario({
      nombres,
      apellidos,
      cedulaNumero,
      nivel,
      codigoIPSA,
      correo,
      telefono,
      tituloFoto,
      cedulaFoto,
    });

    await nuevoVeterinario.save();

    res.status(201).json({
      message:
        "Registro enviado. Nuestro equipo verificará la información en un plazo de 5 a 7 días hábiles.",
      veterinario: nuevoVeterinario,
    });
  } catch (error) {
    console.error("❌ Error al registrar veterinario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 Obtener todos los veterinarios
export const obtenerVeterinarios = async (req, res) => {
  try {
    const veterinarios = await Veterinario.find().sort({ createdAt: -1 });
    res.json(veterinarios);
  } catch (error) {
    console.error("❌ Error al obtener veterinarios:", error);
    res.status(500).json({ message: "Error al obtener los registros." });
  }
};

// 🔹 Obtener veterinario por ID
export const obtenerVeterinarioPorId = async (req, res) => {
  try {
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) return res.status(404).json({ message: "Veterinario no encontrado." });
    res.json(veterinario);
  } catch (error) {
    console.error("❌ Error al buscar veterinario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// 🔹 Eliminar veterinario
export const eliminarVeterinario = async (req, res) => {
  try {
    const eliminado = await Veterinario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: "Veterinario no encontrado." });
    res.json({ message: "Veterinario eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar veterinario:", error);
    res.status(500).json({ message: "Error al eliminar el registro." });
  }
};
