import express from 'express';
import { getProjectsByCategory, getProjectBySlug, getActiveCategories } from '../controllers/projectController.js';

const router = express.Router();

router.get('/active-categories', getActiveCategories);
router.get('/category/:category', getProjectsByCategory);
router.get('/profile/:id/:slug', getProjectBySlug);

export default router;
