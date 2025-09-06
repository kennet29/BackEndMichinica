import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Settings
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


// Routes
app.use("/api", indexRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/auth", authRoutes);


export default app;
