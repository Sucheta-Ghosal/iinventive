import express from 'express';
import { registerVC, getVCs, checkUsername, loginUser, toggleInterest, getVCInterests, getPopulatedVCInterests, getParticipantProjects, requestMeetup, getRequestedVCs, getVCMeetups, updateVCMeetupStatus } from '../controllers/userController.js';

const router = express.Router();

router.post('/vc', registerVC);
router.post('/login', loginUser);
router.post('/interest/:projectId', toggleInterest);
router.post('/meetup/:vcId', requestMeetup);
router.get('/meetup/:userId', getRequestedVCs);
router.get('/vc-meetups/:vcUserId', getVCMeetups);
router.put('/vc-meetups-status/:vcUserId/:participantUserId', updateVCMeetupStatus);
router.get('/participant-projects/:userId', getParticipantProjects);
router.get('/interest-populated/:userId', getPopulatedVCInterests);
router.get('/interest/:userId', getVCInterests);
router.get('/vcs', getVCs);
router.get('/check/:username', checkUsername);

export default router;
