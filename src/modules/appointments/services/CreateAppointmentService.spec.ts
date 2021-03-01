import 'reflect-metadata';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentRepository from '@modules/appointments/repositories/Fakes/FakeAppointmentRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('Should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({date: new Date(2020, 4, 10, 13), provider_id: '123123123', user_id:'123123'});

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('Should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const creteAppointment = new CreateAppointmentService(
      fakeAppointmentRepository
    );

    const appointmentDate = new Date(2021, 2, 20, 9);
    await creteAppointment.execute({date: appointmentDate, provider_id: 'provider_id', user_id: 'user_id'});

    await expect(creteAppointment.execute({date: appointmentDate, provider_id: 'provider_id', user_id: 'user_id'})).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment on a past date', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({date: new Date(2020, 4, 10, 11), provider_id: 'provider_id', user_id: 'user_id'})).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment with same user as provider', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({date: new Date(2020, 4, 10, 11), provider_id: 'provider_id', user_id: 'user_id'})).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment with same user as provider', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({date: new Date(2020, 4, 10, 11), provider_id: 'provider_id', user_id: 'user_id'})).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment before 8am and after 5pm', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointmentService.execute({date: new Date(2020, 4, 11, 7), provider_id: 'provider_id', user_id: 'user_id'})).rejects.toBeInstanceOf(AppError);

    await expect(createAppointmentService.execute({date: new Date(2020, 4, 11, 18), provider_id: 'provider_id', user_id: 'user_id'})).rejects.toBeInstanceOf(AppError);
  });
});
