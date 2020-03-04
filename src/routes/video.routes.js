import express from 'express';
import VideoController from '../controllers/video.controller';

const router = express.Router();

router.get('/videoById', (req, res) => VideoController.videoById(req, res));

export default router;
