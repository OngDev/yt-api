import express from 'express';

import videoRoutes from './video.routes';

const apiRouter = express();
apiRouter.use('/', videoRoutes);
export default apiRouter;
