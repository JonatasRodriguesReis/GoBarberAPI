import {Request, Response} from 'express';
import { parseISO } from 'date-fns';
import {container} from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController{
  public async create(request:Request, response: Response): Promise<Response>{
    const user_id = request.user.id;
    const { provider_id, date } = request.body;
    const isoDate = parseISO(date);
    const createAppointmentService = container.resolve(CreateAppointmentService);

    try {
        const appointment = await createAppointmentService.execute({
            provider_id,
            user_id,
            date: isoDate
        });

        return response.status(200).json(appointment);
    } catch (error) {
        return response
            .status(error.statusCode)
            .json({ message: error.message });
    }
  }
}
