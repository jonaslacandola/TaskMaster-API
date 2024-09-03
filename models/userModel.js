import bcrypt from "bcryptjs";
import { Schema, Mongoose, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 10,
    select: false,
  },
  pfp: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(this.password, salt);

  this.password = hashPassword;

  next();
});

const User = model("User", userSchema);

export default User;
