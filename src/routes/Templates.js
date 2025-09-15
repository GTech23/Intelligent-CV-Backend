import express from 'express';
import mongoose from 'mongoose';
import { createTemplate, deleteTemplate, getTemplates } from '../controllers/template.controller.js';
import authorizeAuth from '../middlewares/authorize.js';
import { authorizeAdmin } from '../middlewares/authorizeAdmin.js';

const templateRouter = express.Router();

templateRouter.post('/create', authorizeAuth, authorizeAdmin, createTemplate );
templateRouter.get('/', authorizeAuth, authorizeAdmin, getTemplates );
templateRouter.delete('/:id', authorizeAuth, authorizeAdmin, deleteTemplate)

export default templateRouter;