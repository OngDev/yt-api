import express from 'express';

import videoRoutes from './video.routes';
import playlistRoutes from './playlist.routes';

const apiRouter = express();
apiRouter.use('/', videoRoutes);
apiRouter.use('/', playlistRoutes);
export default apiRouter;
