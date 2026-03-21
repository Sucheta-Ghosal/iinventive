import express from 'express';
import { registerVC, getVCs, checkUsername, loginUser, toggleInterest, getVCInterests } from '../controllers/userController.js';

const router = express.Router();

router.post('/vc', registerVC);
router.post('/login', loginUser);
router.post('/interest/:projectId', toggleInterest);
router.get('/interest/:userId', getVCInterests);
router.get('/vcs', getVCs);
router.get('/check/:username', checkUsername);

export default router;
