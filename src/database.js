// src/storage.js
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { MONGODB_URI } from "./config.js";

// ⚡ Configuración de almacenamiento en GridFS
const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve) => {
      const filename = `${Date.now()}-${file.originalname}`;
      const fileInfo = {
        filename,
        bucketName: "uploads", // 👈 colecciones: uploads.files y uploads.chunks
      };
      resolve(fileInfo);
    });
  },
});

// 📦 Middleware Multer
const upload = multer({ storage });

export default upload;
