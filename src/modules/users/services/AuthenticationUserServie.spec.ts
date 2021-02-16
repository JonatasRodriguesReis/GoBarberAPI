import 'reflect-metadata';
import AuthenticateUserService from './AuthenticateService';
import FakeHashProvider from '../providers/HashProviders/fakes/FakeHashProvider';
import CreateUserService from './RegisterUserClientService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('Should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);

    const createUser = new CreateUserService(
      fakeUserRepository, fakeHashProvider
    );
    const user = await createUser.execute({name: 'John Doe', email: 'john@gmail.com', password: '123123'});

    const response = await authenticateUserService.execute({email:"john@gmail.com", password: '123123'});

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate with non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);

    expect(authenticateUserService.execute({email:"john@gmail.com", password: '123123'})).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);

    const createUser = new CreateUserService(
      fakeUserRepository, fakeHashProvider
    );
    const user = await createUser.execute({name: 'John Doe', email: 'john@gmail.com', password: '123123'});

    expect(authenticateUserService.execute({email:"john@gmail.com", password: '123456'})).rejects.toBeInstanceOf(AppError)
  });
});
