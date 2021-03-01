import {Request, Response} from 'express';
import { parseISO } from 'date-fns';
import {container} from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController{
  public async index(request:Request, response: Response): Promise<Response>{
    const user_id = request.user.id;
    const listProvidersService = container.resolve(ListProvidersService);

    try {
        const listProviders = await listProvidersService.execute({
          user_id
        });

        return response.status(200).json(listProviders);
    } catch (error) {
        return response
            .status(error.statusCode)
            .json({ message: error.message });
    }
  }
}
