import { Router } from "express";
import authorizeAuth from "../middlewares/authorize.js";
import { createResume, deleteResume, getResume, getResumes, updateResume } from "../controllers/resume.controller.js";
const resumeRouter = Router();

resumeRouter.post("/", authorizeAuth, createResume);
resumeRouter.get("/:id", authorizeAuth, getResumes);
resumeRouter.get("/:id", authorizeAuth, getResume)
resumeRouter.put('/:id', authorizeAuth,  updateResume);
resumeRouter.delete('/:id', authorizeAuth, deleteResume);

export default resumeRouter;
