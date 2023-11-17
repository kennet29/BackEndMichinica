import { Router } from "express";
import {
  getAllStock,
  createNewStock,
  updateStockByID
} from "../controllers/stock.controller.js";

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllStock);

router.post("/",  createNewStock);

router.put("/:id",  updateStockByID);


export default router;
