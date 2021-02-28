import { Router } from 'express';
import EnsureAunthenticated from '@shared/infra/http/midleware/ensureAuthenticated';
import ProfileController from '../../controllers/UserProfileController';
import ShowProfileController from '../../controllers/UserProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(EnsureAunthenticated);

profileRouter.put('/', profileController.update);

profileRouter.get('/', profileController.show);

export default profileRouter;
