import express from 'express';
import { generateBulletPoint, generateSummary } from '../controllers/gemini.controller.js';

const aiRouter = express.Router();

aiRouter.post('/', generateBulletPoint);
aiRouter.post('/summary', generateSummary);
export default aiRouter;