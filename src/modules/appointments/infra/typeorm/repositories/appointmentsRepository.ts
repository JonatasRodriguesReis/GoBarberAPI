import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

interface CreateAppointmentDTO {
    provider: string;
    date: Date;
}

class AppointmentsRepository  implements IAppointmentsRepository {

    private ormRepository: Repository<Appointment>

    constructor() {
      this.ormRepository = getRepository(Appointment);
    }
    public async create({date,provider_id, user_id}: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment = this.ormRepository.create({provider_id,date, user_id});

      await this.ormRepository.save(appointment);

      return appointment;
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointmentFound = await this.ormRepository.findOne({ where: { date } });

        return appointmentFound || undefined;
    }

    public async findAllInMonthFromProvider({provider_id, month, year} : IFindAllInMonthFromProviderDTO): Promise<Appointment[]>{
      const parseMonth = String(month).padStart(2, '0');

      const appointments = await this.ormRepository.find({
        where: {
          provider_id,
          date: Raw(
            dateFieldName => `to_char(${dateFieldName}, 'MM-YYYY') = '${parseMonth}-${year}'`,
          )
        }
      });

      return appointments;
    }

    public async findAllInDayFromProvider({provider_id, month, year, day} : IFindAllInDayFromProviderDTO): Promise<Appointment[]>{
      const parseMonth = String(month).padStart(2, '0');
      const parseDay = String(day).padStart(2, '0');
      const appointments = await this.ormRepository.find({
        where: {
          provider_id,
          date: Raw(
            dateFieldName => `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parseDay}-${parseMonth}-${year}'`,
          )
        }
      });

      return appointments;
    }
}

export default AppointmentsRepository;
