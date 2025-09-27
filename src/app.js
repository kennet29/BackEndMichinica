import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import "./jobs/notificaciones.js";
import NotificacionRoutes from "./routes/Notificacion.routes.js";
import DesparacitacionRoutes from "./routes/Desparacitcion.routes.js";
import MascotasRoutes from "./routes/Mascota.routes.js"
import MascotaperdidasRoutes from "./routes/MascotaPerdida.routes.js"
import AdopcionRoutes from "./routes/Adopcion.routes.js";
import EventoRoutes from "./routes/Eventos.routes.js";
import PublicacionRoutes from "./routes/publicacion.routes.js";
import VacunasRoutes from "./routes/vacunas.routes.js";
import EnfermedadCronicaRoutes from "./routes/enfermedadcronica.routes.js";
import OperacionesRoutes from "./routes/Operaciones.routes.js"
 
const app = express();
app.set("port", process.env.PORT || 4000);
app.set('view engine','ejs');
app.set("json spaces", 4);
app.use(express.static('public'))
app.use(express.static('public/js/bootstrap'))
app.use(express.static('public/images'))
app.use(express.static('src/controllers'))
app.use(express.static('public/js/jquery'))
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
  });
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "script-src 'self' https://cdn.datatables.net; object-src 'self'"
    );
    return next();
  });
app.use(cors());
app.use(morgan("dev"))
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", indexRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mascotas",MascotasRoutes);
app.use("/api/mascotasPerdidas",MascotaperdidasRoutes);
app.use("/api/adopciones",AdopcionRoutes);
app.use("/api/publicaciones",PublicacionRoutes);
app.use("/api/eventos",EventoRoutes);
app.use("/api/notificaciones",NotificacionRoutes);
app.use("/api/desparacitaciones",DesparacitacionRoutes);
app.use("/api/vacunas",VacunasRoutes);
app.use("/api/enfermedades",EnfermedadCronicaRoutes);
app.use("/api/operaciones",OperacionesRoutes);
app.use("/api/mascotas-perdidas",MascotaperdidasRoutes)

export default app;