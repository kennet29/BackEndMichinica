import { Router } from 'express';
import { 
  crearFactura, 
  obtenerFacturas, 
  obtenerFacturaPorId, 
  eliminarFactura,
  exportFacturasToExcel,
  editarFactura,
  printFactura 
} from '../controllers/facturaServicio.controller.js';

const router = Router();
router.post('/', crearFactura);
router.get('/reporte', exportFacturasToExcel);
router.get('/', obtenerFacturas);
router.get('/:id', obtenerFacturaPorId);
router.delete('/:id', eliminarFactura);
router.put('/factura/:id', editarFactura);
router.get('/factura/:id/pdf', printFactura);

export default router;
