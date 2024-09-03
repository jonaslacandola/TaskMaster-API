import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getUserProfile = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const getAllUsers = catchAsync(async (req, res) => {});

export const createUser = catchAsync(async (req, res) => {});

export const updateUser = catchAsync(async (req, res) => {
  const id = req.user._id;
  //Validate email and password
  const updatedUser = await User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  const id = req.user._id;

  await User.findOneAndDelete({ _id: id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
