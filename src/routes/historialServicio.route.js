import { Router } from 'express';
import { 
  crearHistorial, 
  obtenerHistorial, 
  obtenerHistorialPorId, 
  eliminarHistorial 
} from '../controllers/historialServicios.controller.js';

const router = Router();

// Crear un nuevo historial
router.post('/', crearHistorial);

// Obtener todo el historial
router.get('/', obtenerHistorial);

// Obtener un historial por ID
router.get('/:id', obtenerHistorialPorId);

// Eliminar un historial
router.delete('/:id', eliminarHistorial);

export default router;
