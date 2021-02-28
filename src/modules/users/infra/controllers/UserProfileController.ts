import {Request, Response} from 'express';
import {container} from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShoeProfileService from '@modules/users/services/ShowProfileService';

class UpdateUserProfileController{

  public async show(request: Request, response: Response): Promise<Response>{
    const user_id = request.user.id;

    const showProfile = container.resolve(ShoeProfileService);

    const user = await showProfile.execute({user_id});

    return response.status(200).json(user);
  }

  public async update (request: Request, response: Response){
    try {
      const user_id = request.user.id;
      const { name, email, old_password, password } = request.body;

      const updateService = container.resolve(UpdateProfileService);

      const user = await updateService.execute({ user_id, name, email, old_password,password });

      delete user.password;

      return response.status(200).json(user);
    } catch (error) {
        return response
            .status(error.statusCode)
            .json({ message: error.message });
    }
  }
}

export default UpdateUserProfileController;
