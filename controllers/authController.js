import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const login = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    throw new Error("Please provide all fields");

  const user = await User.findOne({ username, email }).select("+password");

  if (!user) throw new Error("User does not exist");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Password does not match");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});

export const signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET,
  });

  res.status(201).json({
    status: "success",
    data: {
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        pfp: newUser.pfp,
      },
    },
  });
});
