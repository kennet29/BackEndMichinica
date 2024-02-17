import { Router } from "express";
import {
 getAllDetVentas,
 createNewDetVentas,
 
 printDetallesVenta
} from "../controllers/detallesVentas.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllDetVentas);

router.post("/", createNewDetVentas);

router.get("/:id/print", printDetallesVenta);



export default router;
