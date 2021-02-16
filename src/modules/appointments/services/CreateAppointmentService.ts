/* eslint-disable camelcase */
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import {inject, injectable} from 'tsyringe';
import Appointment from '../infra/typeorm/entities/appointment';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppError from '../../../shared/errors/AppError';

interface IRequest {
    provider_id: string;
    date: Date;
    //id_user: string;
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
        date
    }: IRequest): Promise<Appointment> {

        const parsedDate = startOfHour(date);
        const findAppointmentInSameDate = await this.appointmentRepository.findByDate(
            parsedDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('Hour of appointment is unvailable.');
        }

        const appointment = await this.appointmentRepository.create({
            provider_id:provider_id,
            date: parsedDate
        });

        return appointment;
    }
}

export default CreateAppointmentService;
