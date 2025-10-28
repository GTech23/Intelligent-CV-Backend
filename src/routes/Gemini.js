import express from 'express';
import { generateBulletPoint, generateSummary, generateSkills } from '../controllers/gemini.controller.js';

const aiRouter = express.Router();

aiRouter.post('/', generateBulletPoint);
aiRouter.post('/summary', generateSummary);
aiRouter.post('/skills', generateSkills);
export default aiRouter;