import User from "../models/User.js";
import { ROLES } from "../models/Role.js";

export const checkExistingUser = async (req, res, next) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound)
      return res.status(400).json({ message: "The user already exists" });

    const email = await User.findOne({ email: req.body.email });
    if (email)
      return res.status(400).json({ message: "The email already exists" });

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkExistingRole = (req, res, next) => {
  if (!req.body.roles || !Array.isArray(req.body.roles)) {
    return res.status(400).json({ message: "Invalid roles data" });
  }

  if (req.body.roles.length === 0) {
    return res.status(400).json({ message: "No roles provided" });
  }

  const invalidRoles = [];
  for (let i = 0; i < req.body.roles.length; i++) {
    if (!ROLES.includes(req.body.roles[i])) {
      invalidRoles.push(req.body.roles[i]);
    }
  }

  if (invalidRoles.length) {
    return res.status(400).json({
      message: `Roles do not exist: ${invalidRoles.join(", ")}`,
    });
  }

  next();
};
