import express from 'express';
import PlaylistController from '../controllers/playlist.controller';

const router = express.Router();

router.get('/playlists', (req, res) => PlaylistController.getPlaylists(req, res));

export default router;
