import { ROLES } from "../models/Role";




const roleController = {

  getRoleNameById: async (req, res) => {
    try {
      const roleId = req.params._id; 
      
   s
      const role = await ROLES.findById(roleId);

      if (!role) {
        return res.status(404).json({ message: 'Rol no encontrado' });
      }

   
      res.status(200).json({ roleName: role.name });
    } catch (error) {
      console.error('Error al obtener el nombre del rol por ID:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
};

export default roleController;
