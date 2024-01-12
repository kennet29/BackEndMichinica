import { Router } from "express";
import {
  getAllStock,
  createNewStock,
  updateExistenciasByID
} from "../controllers/stock.controller.js";

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllStock);

router.post("/",  createNewStock);

router.put("/:id",  updateExistenciasByID);


export default router;
