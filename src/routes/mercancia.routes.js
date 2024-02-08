import { Router } from "express";
import {
    getAllMerc_dañada,
    createNewMerc_dañada,
    getMerc_dañadaByID,
    deleteMerc_dañadaById,
    updateMerc_dañadaById
  } from "../controllers/mercancias.controller.js"; 

import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", getAllMerc_dañada); // Use getAllBodega instead of getBodega for fetching all bodegas
router.post("/", createNewMerc_dañada); // Create a new bodega
router.get("/:id",getMerc_dañadaByID); // Get a specific bodega by its ID
router.delete("/:id",[verifyToken,isAdmin], deleteMerc_dañadaById); // Delete a bodega by its ID
router.put("/:id",[verifyToken,isAdmin], updateMerc_dañadaById); // Update a specific bodega by its ID

export default router;