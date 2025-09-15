import express from 'express';
import mongoose from 'mongoose';
import { createTemplate, deleteTemplate, getTemplates } from '../controllers/template.controller.js';
import authorizeAuth from '../middlewares/authorize.js';

const templateRouter = express.Router();

templateRouter.post('/create', authorizeAuth, createTemplate );
templateRouter.get('/', authorizeAuth, getTemplates );
templateRouter.delete('/:id', authorizeAuth, deleteTemplate)

export default templateRouter;