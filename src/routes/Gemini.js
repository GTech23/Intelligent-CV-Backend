import express from 'express';
import { generateBulletPoint } from '../controllers/gemini.controller.js';

const aiRouter = express.Router();

aiRouter.post('/', generateBulletPoint);
export default aiRouter;