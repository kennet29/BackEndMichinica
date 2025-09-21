import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import { GridFSBucket } from "mongodb";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

let gfs;

// Conexión a MongoDB
try {
  const db = await mongoose.connect(MONGODB_URI);
  console.log("✅ Database is connected to", db.connection.name);

  // Inicializar GridFS
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads", // colecciones -> uploads.files y uploads.chunks
  });

  console.log("✅ GridFS inicializado con bucket:", "uploads");
} catch (error) {
  console.error("❌ Error de conexión a MongoDB:", error.message);
}

export const getGFS = () => gfs;

// 📂 Configuración de Multer con GridFS
const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    return {
      bucketName: "uploads",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const upload = multer({ storage });
