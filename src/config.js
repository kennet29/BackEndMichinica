import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://kennethparrales:MICHINICA@mafystore.rswlg1d.mongodb.net/?retryWrites=true&w=majority&appName=MafyStore";

export const PORT = process.env.PORT || 4000;
export const SECRET = "MAGUEY";


export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@localhost";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";