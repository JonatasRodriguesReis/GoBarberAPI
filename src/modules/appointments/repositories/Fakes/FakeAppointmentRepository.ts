import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import {uuid} from 'uuidv4';
import {isEqual, getMonth, getDate, getYear, getDay } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';

class AppointmentsRepository  implements IAppointmentsRepository {

    private appintments: Appointment[] = [];

    public async create({date,provider_id, user_id}: ICreateAppointmentDTO): Promise<Appointment> {
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

    public async findAllInMonthFromProvider({month, year, provider_id, }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
      const findAppointment = this.appintments.filter((appointment) =>{
        return (
          appointment.provider_id === provider_id &&
          getMonth(appointment.date) + 1 == month &&
          getYear(appointment.date) === year
        );
      });

      return findAppointment;
    }

    public async findAllInDayFromProvider({month, year, day, provider_id, }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
      const findAppointment = this.appintments.filter((appointment) =>{
        return (
          appointment.provider_id === provider_id &&
          getDate(appointment.date) === day &&
          getMonth(appointment.date) + 1 == month &&
          getYear(appointment.date) === year
        );
      });

      return findAppointment;
    }
}

export default AppointmentsRepository;
