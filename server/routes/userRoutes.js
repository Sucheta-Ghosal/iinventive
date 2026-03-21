import express from 'express';
import { registerVC, getVCs } from '../controllers/userController.js';

const router = express.Router();

router.post('/vc', registerVC);
router.get('/vcs', getVCs);

export default router;
