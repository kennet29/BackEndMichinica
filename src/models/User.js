import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "El nombre de usuario es obligatorio"],
      trim: true,
      minlength: [3, "Debe tener al menos 3 caracteres"]
    },
    nombre: {
      type: String,
      required: [true, "El nombre completo es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "El correo es obligatorio"],
      match: [/.+@.+\..+/, "Correo inválido"]
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "Debe tener al menos 6 caracteres"]
    },
    fotoPerfilId: {
      type: mongoose.Schema.Types.ObjectId, // referencia a GridFS
      ref: "fs.files"
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
