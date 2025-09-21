import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";
import { GridFSBucket } from "mongodb";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

let gfs;

// 🔹 Configurar strictQuery para evitar el warning
mongoose.set("strictQuery", true); // o false si prefieres queries flexibles

// Conexión a MongoDB
try {
  const db = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
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
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    if (!file || !file.originalname) {
      return null; // evita error si no hay archivo
    }
    return {
      bucketName: "uploads",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const upload = multer({ storage });
