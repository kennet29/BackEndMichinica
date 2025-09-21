import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import { GridFSBucket } from "mongodb";

let gfs;

try {
  const db = await mongoose.connect(MONGODB_URI);
  console.log("Database is connected to", db.connection.name);

  // 🚀 Inicializar GridFS
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads"  // colecciones -> uploads.files y uploads.chunks
  });

  console.log("GridFS inicializado con bucket:", "uploads");

} catch (error) {
  console.error("Error de conexión a MongoDB:", error.message);
}

export const getGFS = () => gfs;
