import { container } from 'tsyringe';

import '@modules/users/providers';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/appointmentsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/usersRepository';
import './providers';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);
