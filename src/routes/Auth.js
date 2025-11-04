import { Router } from "express";
import { register, login, getAuthProfile, requestPasswordReset, verifyOtp } from "../controllers/auth.controller.js";
import authorizeAuth from "../middlewares/authorize.js";
const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get('/profile', authorizeAuth, getAuthProfile);
authRouter.post('/request_reset', authorizeAuth, requestPasswordReset);
authRouter.post('/verify-otp', authorizeAuth, verifyOtp);

export default authRouter;
