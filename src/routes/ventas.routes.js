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

router.post("/",[verifyToken,isModerator],  createNewVenta);

router.put("/:id",[verifyToken,isModerator],  updateVentasById);


export default router;