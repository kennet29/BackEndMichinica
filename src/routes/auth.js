const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

// Función para crear un token JWT
function createToken(user) {
  const payload = {
    username: user.username,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: '5m' });

  return token;
}

// Función de middleware de autenticación
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token no válido' });
  }
}

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica las credenciales del usuario, por ejemplo, con una base de datos
  if (username === 'usuario' && password === 'contraseña') {
    const token = createToken({ username });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

// Ruta protegida
router.get('/ruta-protegida', authenticateToken, (req, res) => {
  // Acceso permitido solo si el token es válido
  res.json({ message: 'Acceso permitido' });
});

module.exports = router;
