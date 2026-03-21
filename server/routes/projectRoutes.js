import express from 'express';
import { getProjectsByCategory, getProjectBySlug } from '../controllers/projectController.js';

const router = express.Router();

router.get('/category/:category', getProjectsByCategory);
router.get('/profile/:slug', getProjectBySlug);

export default router;
