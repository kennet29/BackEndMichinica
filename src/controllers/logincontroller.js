import { getConnection, querys, sql } from "../database";

// Controlador para mostrar la página de inicio de sesión
export const getIndex = async (req, res) => {
  try {
    res.render('login', {
      cssPaths: ['/css/estilos-login.css'],
      imagePath: '/images/logo.jpg' // Ruta relativa a la carpeta "public"
    });
  } catch (error) {
    res.render('acceso-denegado', {
      cssPaths: ['/css/estilos-404.css'],
      // Ruta relativa a la carpeta "public"
    });
  }
};


// Controlador para el proceso de inicio de sesión
export const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const pool = await getConnection();
    const userCredentials = await pool
      .request()
      .input('correo', sql.NVarChar(255), correo)
      .input('contraseña', sql.NVarChar(255), contraseña)
      .query(querys.getUserByCredentials);

    if (userCredentials.recordset.length > 0) {
      // Credenciales válidas, redirigir al usuario
      const cssPaths = ['/css/estilos.css', '/css/estilo-footer.css'];
      res.render('index', { cssPaths });
    } else {
      // Credenciales inválidas, mostrar mensaje de error
      res.render('login', {
        cssPaths: ['/css/estilos-login.css'],
        error: 'Credenciales incorrectas'
      });
    }
  } catch (error) {
    // Manejar errores de manera adecuada
    console.error('Error en el controlador de inicio de sesión:', error);
    res.status(500).send('Error interno del servidor');
  }
};

function generateToken(user) {
  const payload = {
    userId: user.id, // Include any user-related data you need
    // Add other claims as needed
  };

  const options = {
    expiresIn: '15m', // Set the token expiration time as needed
  };

  // Sign the token using your secret key from environment variables
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
}