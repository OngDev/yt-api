import express from 'express';
import VideoController from '../controllers/video.controller';
import keycloak from '../configs/keycloak.config';
import { USER_ROLE } from '../constants';

const router = express.Router();

router.get('/videos/:id', keycloak.protect([USER_ROLE.ADMIN, USER_ROLE.USER]), (req, res) => VideoController.videoById(req, res));
router.get('/videos/topview', keycloak.protect([USER_ROLE.ADMIN, USER_ROLE.USER]), (req, res) => VideoController.getMostViewVideos(req, res));
router.get('/videos', keycloak.protect([USER_ROLE.ADMIN, USER_ROLE.USER]), (req, res) => VideoController.getVideos(req, res));

export default router;
