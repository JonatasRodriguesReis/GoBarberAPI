import { getRepository, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

interface CreateAppointmentDTO {
    provider: string;
    date: Date;
}

class AppointmentsRepository  implements IAppointmentsRepository {

    private ormRepository: Repository<Appointment>

    constructor() {
      this.ormRepository = getRepository(Appointment);
    }
    public async create({date,provider_id}: ICreateAppointmentDTO): Promise<Appointment> {
      const appointment = this.ormRepository.create({provider_id,date});

      await this.ormRepository.save(appointment);

      return appointment;
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointmentFound = await this.ormRepository.findOne({ where: { date } });

        return appointmentFound || undefined;
    }
}

export default AppointmentsRepository;
