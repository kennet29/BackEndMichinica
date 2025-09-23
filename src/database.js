import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import { GridFSBucket } from "mongodb";
import multer from "multer";

let gfs;

try {
  const db = await mongoose.connect(MONGODB_URI);
  console.log("✅ Database is connected to", db.connection.name);

  gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
  console.log("✅ GridFS inicializado con bucket: uploads");
} catch (error) {
  console.error("❌ Error de conexión a MongoDB:", error.message);
}

// 👉 Multer usando memoria
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const getGFS = () => gfs;
