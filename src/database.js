import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import { GridFSBucket } from "mongodb";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

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

// 👉 Storage en GridFS
const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: "uploads", // 👈 debe coincidir con el bucket
    };
  },
});

export const upload = multer({ storage });

export const getGFS = () => gfs;
