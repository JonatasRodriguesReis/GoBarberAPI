import 'reflect-metadata';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentRepository from '@modules/appointments/repositories/Fakes/FakeAppointmentRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('Should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);

    const appointment = await createAppointmentService.execute({date: new Date(), provider_id: '123123123'});

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('Should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const creteAppointment = new CreateAppointmentService(
      fakeAppointmentRepository
    );

    const appointmentDate = new Date(2021, 2, 20, 9);
    await creteAppointment.execute({date: appointmentDate, provider_id: '123123'});

    await expect(creteAppointment.execute({date: appointmentDate, provider_id: '123123'})).rejects.toBeInstanceOf(AppError);
  })
});
