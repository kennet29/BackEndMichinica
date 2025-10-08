import cron from "node-cron";
import Vacuna from "../models/Vacuna.js";
import Desparasitacion from "../models/Desparacitacion.js";
import Notificacion from "../models/Notificaciones.js";

cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Iniciando revisión diaria de vacunas y desparasitaciones...");

  const hoy = new Date();
  const diasNotificacion = [7, 3, 1, 0]; 

  try {
    const vacunas = await Vacuna.find({ proximaDosis: { $ne: null } })
      .populate("mascotaId", "nombre usuarioId");

    for (const v of vacunas) {
      if (!v.proximaDosis || !v.mascotaId) continue;

      const diffDias = Math.ceil(
        (v.proximaDosis - hoy) / (1000 * 60 * 60 * 24)
      );

      if (diasNotificacion.includes(diffDias)) {
        const mensaje =
          diffDias === 0
            ? `💉 Hoy toca la vacuna ${v.nombre} de ${v.mascotaId.nombre}.`
            : `💉 Faltan ${diffDias} día(s) para la próxima vacuna ${v.nombre} de ${v.mascotaId.nombre}.`;

        const existe = await Notificacion.findOne({
          usuarioId: v.mascotaId.usuarioId,
          mascotaId: v.mascotaId._id,
          mensaje,
        });

        if (!existe) {
          await Notificacion.create({
            usuarioId: v.mascotaId.usuarioId,
            mascotaId: v.mascotaId._id,
            mensaje,
          });
          console.log("✅ Notificación vacuna creada:", mensaje);
        }
      }

      if (diffDias < 0 && diffDias >= -3) {
        const diasPasados = Math.abs(diffDias);
        const mensaje = `⚠️ La vacuna ${v.nombre} de ${v.mascotaId.nombre} está atrasada desde hace ${diasPasados} día(s).`;

        const existe = await Notificacion.findOne({
          usuarioId: v.mascotaId.usuarioId,
          mascotaId: v.mascotaId._id,
          mensaje,
        });

        if (!existe) {
          await Notificacion.create({
            usuarioId: v.mascotaId.usuarioId,
            mascotaId: v.mascotaId._id,
            mensaje,
          });
          console.log("⚠️ Notificación vacuna atrasada creada:", mensaje);
        }
      }
    }

    const desparasitaciones = await Desparasitacion.find({
      proxima: { $ne: null },
    }).populate("mascotaId", "nombre usuarioId");

    for (const d of desparasitaciones) {
      if (!d.proxima || !d.mascotaId) continue;

      const diffDias = Math.ceil(
        (d.proxima - hoy) / (1000 * 60 * 60 * 24)
      );

      if (diasNotificacion.includes(diffDias)) {
        const mensaje =
          diffDias === 0
            ? `🐾 Hoy toca la desparasitación ${d.tipo || ""} de ${d.mascotaId.nombre}.`
            : `🐾 Faltan ${diffDias} día(s) para la desparasitación ${d.tipo || ""} de ${d.mascotaId.nombre}.`;

        const existe = await Notificacion.findOne({
          usuarioId: d.mascotaId.usuarioId,
          mascotaId: d.mascotaId._id,
          mensaje,
        });

        if (!existe) {
          await Notificacion.create({
            usuarioId: d.mascotaId.usuarioId,
            mascotaId: d.mascotaId._id,
            mensaje,
          });
          console.log("✅ Notificación desparasitación creada:", mensaje);
        }
      }

      if (diffDias < 0 && diffDias >= -3) {
        const diasPasados = Math.abs(diffDias);
        const mensaje = `⚠️ La desparasitación ${d.tipo || ""} de ${d.mascotaId.nombre} está atrasada desde hace ${diasPasados} día(s).`;

        const existe = await Notificacion.findOne({
          usuarioId: d.mascotaId.usuarioId,
          mascotaId: d.mascotaId._id,
          mensaje,
        });

        if (!existe) {
          await Notificacion.create({
            usuarioId: d.mascotaId.usuarioId,
            mascotaId: d.mascotaId._id,
            mensaje,
          });
          console.log("⚠️ Notificación desparasitación atrasada creada:", mensaje);
        }
      }
    }

    console.log("✅ Revisión completa de vacunas y desparasitaciones.\n");
  } catch (error) {
    console.error("❌ Error revisando notificaciones:", error.message);
  }
});
