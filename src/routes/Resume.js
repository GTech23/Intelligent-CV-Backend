import { Router } from "express";
import authorizeAuth from "../middlewares/authorize.js";
import {
  createResume,
  deleteResume,
  getResume,
  getResumes,
  renderResume,
  updateResume,
} from "../controllers/resume.controller.js";
const resumeRouter = Router();

// '/api/resume

resumeRouter.post("/", authorizeAuth, createResume);
resumeRouter.get("/", authorizeAuth, getResumes);
resumeRouter.get("/:id", authorizeAuth, getResume);
resumeRouter.put("/:id", authorizeAuth, updateResume);
resumeRouter.delete("/:id", authorizeAuth, deleteResume);

resumeRouter.get('/:id/view', authorizeAuth, renderResume);

export default resumeRouter;
