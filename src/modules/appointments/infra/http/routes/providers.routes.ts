/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import Router from 'express';
import EnsureAuthenticated from '@shared/infra/http/midleware/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/controllers/ProvidersController';

const providersRouter = Router();

const providersController = new ProvidersController();

providersRouter.use(EnsureAuthenticated);

providersRouter.get('/', providersController.index);

export default providersRouter;
