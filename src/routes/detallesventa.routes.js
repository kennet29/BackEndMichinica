import { Router } from "express";
import {
  getAllDetVentas,
  createNewDetVentas,
  printDetallesVenta,
  obtenerTotalPorCategoriaEnAnio,
} from "../controllers/detallesVentas.controller.js";
//import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllDetVentas);
router.post("/", createNewDetVentas);
router.get("/:id/print", printDetallesVenta);

router.get("/total-Cat/:anio", async (req, res) => {
  try {
    const anio = req.params.anio;
    const resultado = await obtenerTotalPorCategoriaEnAnio(anio);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener el total por categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;




