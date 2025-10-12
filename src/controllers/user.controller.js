import User from "../models/User.js";
import Role from "../models/Role.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // 🔒 necesario para comparar contraseñas

// 📌 Crear usuario
export const createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Todos los campos son obligatorios (username, email, password)" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "El formato del correo electrónico no es válido" });

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists)
      return res.status(409).json({ message: "El usuario o correo ya está en uso" });

    let rolesToAssign = [];
    if (roles && roles.length > 0) {
      const rolesFound = await Role.find({ name: { $in: roles } });
      if (rolesFound.length === 0)
        return res.status(400).json({ message: "Los roles especificados no existen" });
      rolesToAssign = rolesFound.map((r) => r._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      rolesToAssign = [defaultRole._id];
    }

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
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// 📌 Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) return res.status(404).json({ message: "No hay usuarios registrados" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// 📌 Obtener usuario por ID
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "ID de usuario no válido" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// 📌 Obtener solo IDs, usernames y roles
export const getUserNames = async (req, res) => {
  try {
    const users = await User.find({}, "_id username roles").populate("roles", "_id name");
    if (users.length === 0)
      return res.status(404).json({ message: "No hay usuarios registrados" });

    const formatted = users.map((u) => ({
      _id: u._id,
      username: u.username,
      roles: u.roles.map((r) => ({ _id: r._id, name: r.name })),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// 📌 Obtener nombre del rol por ID
export const getRoleNameById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "ID de rol no válido" });

    const role = await Role.findById(id);
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    res.status(200).json({ roleName: role.name });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// 📌 Actualizar usuario general (admin)
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, password, roles } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "ID de usuario no válido" });

    const existingUser = await User.findById(userId);
    if (!existingUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    let rolesToUpdate = [];
    if (roles && roles.length > 0) {
      const found = await Role.find({ _id: { $in: roles } });
      if (found.length !== roles.length)
        return res.status(404).json({ message: "Uno o más roles no existen" });
      rolesToUpdate = found.map((r) => r._id);
    }

    const updatedUser = {
      username: username || existingUser.username,
      email: email || existingUser.email,
      password: password ? await User.encryptPassword(password) : existingUser.password,
      roles: rolesToUpdate.length > 0 ? rolesToUpdate : existingUser.roles,
    };

    const result = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// 📌 Cambiar solo la contraseña (para perfil del usuario)
export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "ID de usuario no válido" });

    if (!password || password.length < 6)
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.password = await User.encryptPassword(password);
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente ✅" });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

// 📌 Obtener roles de un usuario
export const getUserRolesById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "ID de usuario no válido" });

    const user = await User.findById(userId, "roles").populate("roles", "name");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const roles = user.roles.map((r) => ({ _id: r._id, name: r.name }));
    res.status(200).json({ roles });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};
