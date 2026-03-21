import express from 'express';
import { registerVC, getVCs, checkUsername } from '../controllers/userController.js';

const router = express.Router();

router.post('/vc', registerVC);
router.get('/vcs', getVCs);
router.get('/check/:username', checkUsername);

export default router;
