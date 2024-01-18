import { Router } from "express";
import {
  getAllBodega,
  createNewBodega,
  getBodegaById,
  deleteBodegaById,
  getTotalBodegas,
  updateBodegaById
} from "../controllers/bodega.controller.js"; // Make sure to import all the necessary controller functions

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js"; // Make sure to import the required middleware functions

const router = Router();

router.get("/", getAllBodega); // Use getAllBodega instead of getBodega for fetching all bodegas
router.post("/",[verifyToken,isModerator], createNewBodega); // Create a new bodega
router.get("/:id", getBodegaById); // Get a specific bodega by its ID
router.delete("/:id",[verifyToken,isModerator], deleteBodegaById); // Delete a bodega by its ID
router.get("/total", getTotalBodegas); // Get the total number of bodegas
router.put("/:id",[verifyToken,isModerator], updateBodegaById); // Update a specific bodega by its ID

export default router;
