import { Router } from "express";
import {
 getAllVentas,
 getVentaById,
 updateVentasById,
 createNewVenta
} from "../controllers/ventas.controller.js";

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllVentas);

router.get("/:id", getVentaById);

router.post("/",  createNewVenta);

router.put("/:id",  updateVentasById);


export default router;