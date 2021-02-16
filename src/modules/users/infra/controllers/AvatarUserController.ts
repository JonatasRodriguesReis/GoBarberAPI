import { Request, Response} from 'express';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import {container} from 'tsyringe';

class AvatarUserController{
  public async update(request: Request, response: Response){
    try {
      const service = container.resolve(UpdateUserAvatarService);

      const user = await service.execute({
          userId: request.user.id,
          avatarFileName: request.file.filename,
      });

      return response.status(200).json(user);
    } catch (error) {
        return response
            .status(error.statusCode)
            .json({ error: error.message });
    }
  }
}

export default AvatarUserController;
