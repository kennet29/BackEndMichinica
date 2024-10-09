import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Orlando:Orlando1234@mafystore.rswlg1d.mongodb.net/?retryWrites=true&w=majority";
export const PORT = process.env.PORT || 4000;
export const SECRET = "TammyShop1234";


export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@localhost";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "TammyShop1234";