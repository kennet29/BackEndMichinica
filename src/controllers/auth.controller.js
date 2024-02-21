import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { SECRET } from "../config.js";

export const signupHandler = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Crear un nuevo objeto de usuario
    const newUser = new User({
      username,
      email,
      password,
    });

    // Verificar roles
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }


    const savedUser = await newUser.save();

   const token = jwt.sign({ id: savedUser._id }, SECRET, {
  expiresIn: '1d', 
});

    return res.status(200).json({ token, _id: savedUser._id });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};  

export const signinHandler = async (req, res) => {
  try {
 
    const userFound = await User.findOne({ email: req.body.email }).populate(
      "roles"
    );

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res.status(401).json({
        token: null,
        message: "Contraseña inválida",
      });

 
    const token = jwt.sign({ id: userFound._id }, SECRET, {
      expiresIn: '1d', 
    });

    res.json({ token, _id: userFound._id });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

const blacklist = new Map();

const invalidateToken = (userId, tokenToInvalidate) => {
  if (!blacklist.has(userId)) {
    blacklist.set(userId, new Set());
  }
  blacklist.get(userId).add(tokenToInvalidate);
};

export const logoutHandler = async (req, res) => {
  let tokenToInvalidate;

  try {
    tokenToInvalidate = req.headers['x-access-token'];

    if (!tokenToInvalidate) {
      return res.status(400).json({ message: "Token not provided in the header" });
    }

    const decodedToken = jwt.verify(tokenToInvalidate, SECRET);
    const userId = decodedToken.id;

    if (blacklist.has(userId) && blacklist.get(userId).has(tokenToInvalidate)) {
      return res.status(401).json({ message: "Token already invalidated, session closed", originalToken: tokenToInvalidate, decodedToken });
    }

    // Perform additional actions upon logging out if necessary
    // For example, closing the session in the database for traditional sessions (not applicable to JWTs)

    invalidateToken(userId, tokenToInvalidate);

    res.status(200).json({ message: "Session closed successfully", invalidatedToken: tokenToInvalidate, originalToken: tokenToInvalidate, decodedToken, userId });
  } catch (error) {
    console.error(error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired, session closed", originalToken: tokenToInvalidate });
    }

    // Handle other types of errors gracefully
    res.status(500).json({ message: "Error while logging out", originalToken: tokenToInvalidate, error: error.message });
  }
};

