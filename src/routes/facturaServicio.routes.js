import { Router } from 'express';
import { 
  crearFactura, 
  obtenerFacturas, 
  obtenerFacturaPorId, 
  eliminarFactura,
  exportFacturasToExcel 
} from '../controllers/facturaServicio.controller.js';

const router = Router();

router.post('/', crearFactura);

router.get('/reporte', exportFacturasToExcel);  // Mueve la ruta de reporte antes de la ruta con ID

router.get('/', obtenerFacturas);

router.get('/:id', obtenerFacturaPorId);

router.delete('/:id', eliminarFactura);

export default router;
