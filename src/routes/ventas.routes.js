import { Router } from "express";
import {
  getAllVentas,
  getVentaById,
  updateVentasById,
  createNewVenta,
  sumarTotalVentasPorAnio,
  obtenerVentasTotalesPorMes,
  exportVentasToExcel, 
} from "../controllers/ventas.controller.js";

import { verifyToken, isModerator } from "../middlewares/authJwt.js";

const router = Router();


router.get("/reporte", exportVentasToExcel);

router.get("/", getAllVentas);

router.get("/Mes", obtenerVentasTotalesPorMes);
router.get("/:id", getVentaById);

router.post("/", [verifyToken, isModerator], createNewVenta);

router.put("/:id", [verifyToken, isModerator], updateVentasById);

router.get("/total/:anio", async (req, res) => {
  try {
    const anio = parseInt(req.params.anio);
    const totalVentas = await sumarTotalVentasPorAnio(anio);
    res.json({ totalVentas });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el total de ventas por año" });
  }
});

export default router;
