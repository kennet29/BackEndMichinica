import { Router } from "express";
import {
  getAllProveedores,
  createNewProveedor,
  getProveedorById,
  deleteProveedorById,
  updateProveedorById,
} from "../controllers/proveedores.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();


router.get("/", getAllProveedores);
router.post("/",[verifyToken,isModerator], createNewProveedor);
router.get("/:id", getProveedorById);
router.delete("/:id",[verifyToken,isAdmin], deleteProveedorById);
router.put("/:id",[verifyToken,isModerator], updateProveedorById);

export default router;

