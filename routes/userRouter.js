import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUserProfile,
  updateUser,
} from "../controllers/userController.js";
import { login, signup } from "../controllers/authController.js";
import protect from "../utils/protect.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.route("/userprofile").get(protect, getUserProfile);

router.route("/").get(/* get all users */).post(createUser);

router.route("/:id").get(/* get user */).patch(updateUser).delete(deleteUser);

export default router;
