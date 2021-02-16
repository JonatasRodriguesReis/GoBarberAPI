import 'reflect-metadata';
import CreateUserService from './RegisterUserClientService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('Should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(fakeUserRepository, fakeHashProvider);

    const user = await createUserService.execute({name: 'John Doe',email:"john@gmail.com", password: '123123'});

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create two users on the same email', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUserRepository, fakeHashProvider
    );

    await createUser.execute({name: 'John Doe', email: 'john@gmail.com', password: '123123'});

    expect(createUser.execute({name: 'John Doe', email: 'john@gmail.com', password: '123123'})).rejects.toBeInstanceOf(AppError);
  })
});
