import { Router } from "express";
import {
 getAllDetVentas,
 createNewDetVentas,
 updateDetVentasById
} from "../controllers/detallesVentas.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllDetVentas);

router.post("/", createNewDetVentas);

router.put("/:productId", updateDetVentasById);



export default router;
