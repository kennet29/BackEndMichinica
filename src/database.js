import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import mongoose from "mongoose";
import { MONGODB_URI } from "../config.js";

// ⚡ Conexión ya inicializada en tu app
const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    return {
      filename: Date.now() + "-" + file.originalname,
      bucketName: "uploads", // 👈 debe coincidir con el GridFSBucket
    };
  },
});

const upload = multer({ storage });

export default upload;
