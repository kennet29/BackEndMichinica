// src/database.js
import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import { GridFSBucket } from "mongodb";
import multer from "multer";

let gfs;
let bucket;

try {
  const db = await mongoose.connect(MONGODB_URI);
  console.log("✅ Database is connected to", db.connection.name);

  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
  gfs = bucket;
  console.log("✅ GridFS inicializado con bucket: uploads");
} catch (error) {
  console.error("❌ Error de conexión a MongoDB:", error.message);
}

// 👉 Multer sin storage de terceros (usa memoria)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const getGFS = () => gfs;
