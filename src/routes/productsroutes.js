import { Router } from "express";
import {
  getProducts,
  getProductos,
  createNewProduct,
  getProductById,
  deleteProductById,
  getTotalProducts,
  updateProductById,
} from "../controllers/productscontroller";

const { json } = require('express');

const router = Router();

router.get("/products", getProducts);

router.get("/productos", getProductos);

router.post("/productos", createNewProduct);

router.get("/products/count", getTotalProducts);

router.get("/products/:id", getProductById);

router.delete("/products/:id", deleteProductById);

router.put("/productos/:id", updateProductById);

export default router;
