import { Router } from 'express';
import { 
  crearFactura, 
  obtenerFacturas, 
  obtenerFacturaPorId, 
  eliminarFactura,
  exportFacturasToExcel,
  editarFactura
} from '../controllers/facturaServicio.controller.js';

const router = Router();

// Asegúrate de que `/reporte` esté antes de cualquier ruta que use `/:id`
router.post('/', crearFactura);
router.get('/reporte', exportFacturasToExcel);  // Ruta para generar el reporte
router.get('/', obtenerFacturas);
router.get('/:id', obtenerFacturaPorId);
router.delete('/:id', eliminarFactura);
router.put('/factura/:id', editarFactura);

export default router;
