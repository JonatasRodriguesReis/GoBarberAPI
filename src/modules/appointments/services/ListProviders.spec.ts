import 'reflect-metadata';
import ListProvidersService from '../services/ListProvidersService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

describe('List All Providers', () => {
  it('Should be able to list the providers', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const listAllProviderService = new ListProvidersService(fakeUserRepository);

    const user1 =  await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123123'
    });

    const user2 =  await fakeUserRepository.create({
      email: 'john2@gmail.com',
      name: "John Doe2",
      password: '123123'
    });

    const userLogged =  await fakeUserRepository.create({
      email: 'johnTrue@gmail.com',
      name: "John True",
      password: '123123'
    });

    const showProviders = await listAllProviderService.execute(
      {
        user_id: userLogged.id
      }
    );

    expect(showProviders).toEqual([user1, user2]);
  });
});
