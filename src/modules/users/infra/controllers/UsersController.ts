import {Request, Response} from 'express';
import {container} from 'tsyringe';
import RegisterUserClientService from '@modules/users/services/RegisterUserClientService';

class UsersController{
  public async create (request: Request, response: Response){
    try {
      const { name, email, password } = request.body;

      const registerService = container.resolve(RegisterUserClientService);

      const user = await registerService.execute({ name, email, password });

      delete user.password;

      return response.status(200).json(user);
    } catch (error) {
        return response
            .status(error.statusCode)
            .json({ message: error.message });
    }
  }
}

export default UsersController;
