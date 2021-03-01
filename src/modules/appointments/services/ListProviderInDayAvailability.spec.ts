import 'reflect-metadata';
import ListProviderDayAvailabilityService from '../services/ListProviderDayAvailabilityService';
import FakeAppointmentRepository from '@modules/appointments/repositories/Fakes/FakeAppointmentRepository';
import AppError from '@shared/errors/AppError';

describe('List Provider Month Availability', () => {
  it('Should be able to list the month availability from provider', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentRepository);

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availibity = await listProviderDayAvailabilityService.execute(
      {
        provider_id: 'user',
        year: 2020,
        month: 5,
        day: 20
      }
    );

    expect(availibity).toEqual(expect.arrayContaining([
      {hour: 8, available: false},
      {hour: 9, available: false},
      {hour: 10, available: false},
      {hour: 11, available: false},
      {hour: 12, available: true},
      {hour: 13, available: true}
    ]));
  });
});
