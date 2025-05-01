import Router from 'express';
import videoController from '../controllers/videoController.js';
const router = Router();

router.post('/add-progress', videoController.addVideoProgress);
router.get('/:playlistId/:videoId', videoController.getVideoById);

export default router;
