import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import { GridFSBucket } from "mongodb";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

let gfs;

mongoose.set("strictQuery", false);

try {
  const db = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("✅ Database is connected to", db.connection.name);

  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads", 
  });

  console.log("✅ GridFS inicializado con bucket:", "uploads");
} catch (error) {
  console.error("❌ Error de conexión a MongoDB:", error.message);
}

export const getGFS = () => gfs;

const storage = new GridFsStorage({
  url: MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    if (!file || !file.originalname) {
      console.warn("⚠️ Archivo inválido recibido en multer-gridfs-storage");
      return null;
    }

    return {
      bucketName: "uploads",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const upload = multer({ storage });
