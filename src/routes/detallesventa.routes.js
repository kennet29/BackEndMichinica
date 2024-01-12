import { Router } from "express";
import {
 getAllDetVentas,
 createNewDetVentas,
 updateDetVentasById,
 printDetallesVenta
} from "../controllers/detallesVentas.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllDetVentas);

router.post("/", createNewDetVentas);

router.put("/:productId", updateDetVentasById);
router.get("/:id/print", printDetallesVenta);



export default router;
