import { Router } from "express";
import {
  register,
  login,
  getAuthProfile,
  requestPasswordReset,
  verifyOtp,
  updatePassword,
} from "../controllers/auth.controller.js";
import authorizeAuth from "../middlewares/authorize.js";
const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authorizeAuth, getAuthProfile);
authRouter.post("/password_update", authorizeAuth, updatePassword);
authRouter.post("/request_reset", requestPasswordReset);
authRouter.post("/verify-otp", verifyOtp);

export default authRouter;
