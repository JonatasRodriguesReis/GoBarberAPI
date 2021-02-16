import { Router } from 'express';
import multer from 'multer';
import EnsureAunthenticated from '@shared/infra/http/midleware/ensureAuthenticated';
import uploadConfig from '@config/upload';
import UsersController from '../../controllers/UsersController';
import AvatarUserController from '../../controllers/AvatarUserController';

const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const avatarUserController = new AvatarUserController();

usersRouter.post('/', usersController.create);

usersRouter.post(
    '/avatar',
    EnsureAunthenticated,
    upload.single('avatar'),
    avatarUserController.update
);

export default usersRouter;
