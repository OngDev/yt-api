import express from 'express';
import VideoController from '../controllers/video.controller';

const router = express.Router();

router.get('/:videoId', (req, res) => VideoController.videoById(req, res));
router.get('/getMostViewVideos/:videoNumber', (req, res) => VideoController.getMostViewVideos(req, res));

export default router;
