import User from "../models/User.js";
import Role from "../models/Role.js";
import mongoose from "mongoose";

// 📌 Crear usuario
export const createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Validaciones de campos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios (username, email, password)" });
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El formato del correo electrónico no es válido" });
    }

    // Verificar si ya existe el usuario
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(409).json({ message: "El usuario o correo ya está en uso" });
    }

    // Validar roles
    let rolesToAssign = [];
    if (roles && roles.length > 0) {
      const rolesFound = await Role.find({ name: { $in: roles } });
      if (rolesFound.length === 0) {
        return res.status(400).json({ message: "Los roles especificados no existen" });
      }
      rolesToAssign = rolesFound.map((role) => role._id);
    } else {
      // Si no se envían roles, asignar "user" por defecto
      const defaultRole = await Role.findOne({ name: "user" });
      rolesToAssign = [defaultRole._id];
    }

    // Crear usuario
    const user = new User({
      username,
      email,
      password: await User.encryptPassword(password),
      roles: rolesToAssign,
    });

    const savedUser = await user.save();
    return res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 📌 Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No hay usuarios registrados" });
    }
    return res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 📌 Obtener un usuario por ID
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 📌 Obtener solo IDs, usernames y roles
export const getUserNames = async (req, res) => {
  try {
    const users = await User.find({}, "_id username roles").populate("roles", "_id name");
    if (users.length === 0) {
      return res.status(404).json({ message: "No hay usuarios registrados" });
    }

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      username: user.username,
      roles: user.roles.map((role) => ({
        _id: role._id,
        name: role.name,
      })),
    }));

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error al obtener nombres de usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 📌 Obtener nombre del rol por ID
export const getRoleNameById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de rol no válido" });
    }

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.status(200).json({ roleName: role.name });
  } catch (error) {
    console.error("Error al obtener rol por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 📌 Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, password, roles } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let rolesToUpdate = [];
    if (roles && roles.length > 0) {
      const rolesFound = await Role.find({ _id: { $in: roles } });
      if (rolesFound.length !== roles.length) {
        return res.status(404).json({ message: "Uno o más roles no existen" });
      }
      rolesToUpdate = rolesFound.map((role) => role._id);
    }

    const updatedUser = {
      username: username || existingUser.username,
      email: email || existingUser.email,
      password: password ? await User.encryptPassword(password) : existingUser.password,
      roles: rolesToUpdate.length > 0 ? rolesToUpdate : existingUser.roles,
    };

    const result = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    return res.status(200).json({
      _id: result._id,
      username: result.username,
      email: result.email,
      roles: result.roles,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 📌 Obtener roles de un usuario
export const getUserRolesById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    const user = await User.findById(userId, "roles").populate("roles", "name");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userRoles = user.roles.map((role) => ({
      _id: role._id,
      name: role.name,
    }));

    return res.status(200).json({ roles: userRoles });
  } catch (error) {
    console.error("Error al obtener roles de usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
