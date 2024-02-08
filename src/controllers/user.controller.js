import User from "../models/User.js";
import Role from "../models/Role.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    const rolesFound = await Role.find({ name: { $in: roles } });

    // creating a new User
    const user = new User({
      username,
      email,
      password,
      roles: rolesFound.map((role) => role._id),
    });

    // encrypting password
    user.password = await User.encryptPassword(user.password);

    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  return res.json(users);
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  return res.json(user);
};
export const getUserNames = async (req, res) => {
  try {
    const users = await User.find({}, '_id username'); // Retrieve only _id and username fields

    return res.status(200).json(users.map(user => ({ _id: user._id, username: user.username })));
  } catch (error) {
    console.error('Error al obtener los nombres de usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const  getRoleNameById = async (req, res) => {
    try {
      const roleId = req.params.id; 
      

      const role = await Role.findById(roleId);

      if (!role) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }
      res.status(200).json({ roleName: role.name });
    } catch (error) {
      console.error('Error al obtener el nombre del rol por ID:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

 // Importaciones necesarias, como Role y User models

 export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, password, roles } = req.body;

    // Verificar si se proporcionaron roles y encontrar sus IDs
    let rolesToUpdate = [];
    if (roles && roles.length > 0) {
      const rolesFound = await Role.find({ _id: { $in: roles } });

      // Verificar si se encontraron todos los roles proporcionados
      if (rolesFound.length !== roles.length) {
        return res.status(404).json({ message: 'Uno o más roles no encontrados' });
      }

      rolesToUpdate = rolesFound.map((role) => role._id);
    }


    const updatedUser = {
      username,
      email,

      password: password ? await User.encryptPassword(password) : undefined,
    };


    if (rolesToUpdate.length > 0) {
      updatedUser.roles = rolesToUpdate;
    }


    delete updatedUser._id;

   
    const result = await User.findByIdAndUpdate(userId, updatedUser, { new: true });

   
    if (!result) {
      return res.status(404).json({ message: 'Error al actualizar el usuario' });
    }

    return res.status(200).json({
      _id: result._id,
      username: result.username,
      email: result.email,
      roles: result.roles,
    });
  } catch (error) {
    console.error('Error al editar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};