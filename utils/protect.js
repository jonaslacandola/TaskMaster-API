import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import catchAsync from "./catchAsync.js";

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new Error("Unauthorized login, no token!");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  freshUser = await User.findById(decoded.id);

  if (!freshUser)
    throw new Error("The user belonging to the token does not exists!");

  req.user = freshUser;

  next();
});

export default protect;
