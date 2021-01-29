import express from 'express';
import VideoController from '../controllers/video.controller';

const router = express.Router();

router.get('/videos', (req, res) => VideoController.getVideos(req, res));
router.get('/videos/topview', (req, res) => VideoController.getMostViewVideos(req, res));
router.get('/videos/:id', (req, res) => VideoController.videoById(req, res));

export default router;
