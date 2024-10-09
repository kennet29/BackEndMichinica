import { Router } from 'express';
import {
  crearServicio,
  obtenerServicios,
  obtenerServicioPorId,
  actualizarServicio,
  eliminarServicio
} from '../controllers/servicios.controller.js';

const router = Router();

router.get('/', obtenerServicios);
router.post('/', crearServicio);
router.get('/:id', obtenerServicioPorId);
router.put('/:id', actualizarServicio);
router.delete('/:id', eliminarServicio);

export default router;
