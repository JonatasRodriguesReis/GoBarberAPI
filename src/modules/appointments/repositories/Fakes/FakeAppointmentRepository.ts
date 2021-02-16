import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import {uuid} from 'uuidv4';
import {isEqual} from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';

interface CreateAppointmentDTO {
    provider: string;
    date: Date;
}

class AppointmentsRepository  implements IAppointmentsRepository {

    private appintments: Appointment[] = [];

    public async create({date,provider_id}: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment  = new Appointment();

      appointment.id = uuid();
      appointment.date = date;
      appointment.provider_id = provider_id;

      this.appintments.push(appointment);

      return appointment;
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appintments.find((appointment) => isEqual(appointment.date, date));

        return findAppointment;
    }
}

export default AppointmentsRepository;
