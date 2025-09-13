import { Router } from "express";
import { register, login, getAuthProfile } from "../controllers/auth.controller.js";
import authorizeAuth from "../middlewares/authorize.js";
const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get('/profile', authorizeAuth, getAuthProfile)
export default authRouter;
