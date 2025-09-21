import cron from "node-cron";
import Desparasitacion from "../models/Desparacitacion.js";
import Mascota from "../models/Mascota.js";
import Notificacion from "../models/Notificaciones.js";

cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Revisando desparasitaciones...");

  const hoy = new Date();
  const diasNotificacion = [7, 3, 1, 0];

  try {
    const desparasitaciones = await Desparasitacion.find()
      .populate("mascotaId", "nombre usuarioId");

    for (const d of desparasitaciones) {
      if (!d.proxima) continue;

      const diffDias = Math.ceil((d.proxima - hoy) / (1000 * 60 * 60 * 24));

      if (diasNotificacion.includes(diffDias)) {
        const mensaje =
          diffDias === 0
            ? `Hoy toca la desparasitación ${d.tipo} de ${d.mascotaId.nombre}.`
            : `Faltan ${diffDias} días para la desparasitación ${d.tipo} de ${d.mascotaId.nombre}.`;

        // ✅ Verificar si ya existe esa notificación para evitar duplicados
        const existe = await Notificacion.findOne({
          usuarioId: d.mascotaId.usuarioId,
          mascotaId: d.mascotaId._id,
          mensaje
        });

        if (!existe) {
          await Notificacion.create({
            usuarioId: d.mascotaId.usuarioId,
            mascotaId: d.mascotaId._id,
            mensaje
          });
          console.log("✅ Notificación creada:", mensaje);
        }
      }
    }
  } catch (error) {
    console.error("❌ Error revisando notificaciones:", error.message);
  }
});
