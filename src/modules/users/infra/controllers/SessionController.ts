import {Request, Response} from 'express';
import {container} from 'tsyringe';
import AuthenticateService from '@modules/users/services/AuthenticateService';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response>{
    try {
        const { email, password } = request.body;

        const authenticateSession = container.resolve(AuthenticateService);
        const token = await authenticateSession.execute({ email, password });

        return response.status(200).json(token);
    } catch (error) {
        return response.status(error.statusCode).json({ error: error.message });
    }
  }
};
