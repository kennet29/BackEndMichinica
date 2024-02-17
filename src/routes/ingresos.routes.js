import { Router } from "express";
import {
  getAllIngresos,
  createNewIngresos,
  updateIngresoById,
  deleteIngresoByID,
  getIngresoById
} from "../controllers/ingresos.controller.js";
import { isAdmin,isModerator,verifyToken } from "../middlewares/authJwt.js";

const router = Router();


router.get("/", getAllIngresos);
router.post("/",[verifyToken,isModerator], createNewIngresos);
router.put("/:categoriaId",[verifyToken,isModerator], updateIngresoById);
router.delete("/:categoriaId",[verifyToken,isAdmin], deleteIngresoByID);
router.get("/:id",getIngresoById);


export default router;
