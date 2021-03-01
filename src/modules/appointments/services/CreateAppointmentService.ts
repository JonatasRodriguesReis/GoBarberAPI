/* eslint-disable camelcase */
import { startOfHour, isBefore, getHours } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import {inject, injectable} from 'tsyringe';
import Appointment from '../infra/typeorm/entities/appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppError from '../../../shared/errors/AppError';

interface IRequest {
    provider_id: string;
    date: Date;
    user_id: string;
}

@injectable()
class CreateAppointmentService {

    constructor(
      @inject('AppointmentsRepository')
      private appointmentRepository: IAppointmentRepository
    ) {

    }

    public async execute({
        provider_id,
        date,
        user_id
    }: IRequest): Promise<Appointment> {

        const parsedDate = startOfHour(date);

        if(isBefore(parsedDate, Date.now())){
          throw new AppError("You can't create an appointment on a past date.");
        }

        if(user_id === provider_id){
          throw new AppError("You can't create an appointment with yourself.")
        }

        if(getHours(parsedDate) < 8 || getHours(parsedDate) > 17 ){
          throw new AppError("You can only create an appointment between 8am and 5pm.");
        }

        const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
            parsedDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('Hour of appointment is unvailable.');
        }

        const appointment = await this.appointmentRepository.create({
            provider_id:provider_id,
            date: parsedDate,
            user_id
        });

        return appointment;
    }
}

export default CreateAppointmentService;
