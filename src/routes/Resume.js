import { Router } from "express";
import authorizeAuth from "../middlewares/authorize.js";
import {
  createResume,
  deleteResume,
  getResume,
  getResumes,
  renderResume,
  updateResume,
  downloadResume,
} from "../controllers/resume.controller.js";
import { downloadLimiter } from "../middlewares/rateLimiter.js";
const resumeRouter = Router();

// '/api/resume
resumeRouter.post("/", authorizeAuth, createResume);
resumeRouter.get("/", authorizeAuth, getResumes);
resumeRouter.get("/:id", authorizeAuth, getResume);
resumeRouter.put("/:id", authorizeAuth, updateResume);
resumeRouter.delete("/:id", authorizeAuth, deleteResume);

resumeRouter.post("/:id/view", renderResume);
resumeRouter.post(
  "/:id/download",
  authorizeAuth,
  downloadLimiter,
  downloadResume
);

export default resumeRouter;
