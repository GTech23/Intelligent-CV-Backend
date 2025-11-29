import { Router } from "express";
import {
  register,
  login,
  getAuthProfile,
  requestPasswordReset,
  verifyOtp,
  updatePassword,
  resetPasword,
} from "../controllers/auth.controller.js";
import authorizeAuth from "../middlewares/authorize.js";
import { resetPasswordLimiter } from "../middlewares/rateLimiter.js";
const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authorizeAuth, getAuthProfile);
authRouter.post("/password_update", authorizeAuth, updatePassword);
authRouter.post("/request_reset", resetPasswordLimiter, requestPasswordReset);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPasword);

export default authRouter;
