import { Router } from "express";
import { getIndex, login } from "../controllers/logincontroller"; // Añade la importación de la función "login"

const router = Router();

// Ruta para mostrar la página de inicio de sesión
router.get("/login", getIndex);

// Ruta para manejar el inicio de sesión (POST)
router.post("/login", login);

// Ruta de inicio de la aplicación (por ejemplo, la página principal)
router.get('/', (req, res) => {
  const cssPaths = ['/css/estilos-login.css'];
  res.render('login.ejs', { cssPaths });
});

export default router;
