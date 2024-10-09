import { Router } from 'express';
import { 
  crearFactura, 
  obtenerFacturas, 
  obtenerFacturaPorId, 
  eliminarFactura 
} from '../controllers/facturaServicio.controller.js';

const router = Router();

router.post('/', crearFactura);

router.get('/', obtenerFacturas);

router.get('/:id', obtenerFacturaPorId);

router.delete('/:id', eliminarFactura);

export default router;
