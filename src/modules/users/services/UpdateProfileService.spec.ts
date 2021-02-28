import 'reflect-metadata';
import UpdateProfileService from '../services/UpdateProfileService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('UpdateProfile', () => {
  it('Should be able to update a user profile', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeHashProvider = new FakeHashProvider();
    const updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider);

    const user =  await fakeUserRepository.create({
      email: 'John@gmail.com',
      name: "John Doe",
      password: '123123'
    })

    const updatedUser = await updateProfileService.execute(
      {
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com'
      }
    );

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('Should not be able to update a non-existing user profile', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeHashProvider = new FakeHashProvider();
    const updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider);

    await expect(updateProfileService.execute(
      {
        user_id: 'non-existing user',
        name: 'John Trê',
        email: 'johntre@example.com'
      }
    )).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to change to another user email', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeHashProvider = new FakeHashProvider();
    const updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider);

    await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123123'
    });

    const user =  await fakeUserRepository.create({
      email: 'test@gmail.com',
      name: "John Test",
      password: '123123'
    });

    await expect(updateProfileService.execute(
      {
        user_id: user.id,
        name: 'John Test',
        email: 'john@gmail.com'
      }
    )).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update the password without old password', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeHashProvider = new FakeHashProvider();
    const updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider);

    const user = await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123456'
    });

    await expect(updateProfileService.execute(
      {
        user_id: user.id,
        name: 'John Test',
        email: 'johntest@gmail.com',
        password: '123123'
      }
    )).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update the password with wrong old password', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeHashProvider = new FakeHashProvider();
    const updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider);

    const user = await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123456'
    });

    await expect(updateProfileService.execute(
      {
        user_id: user.id,
        name: 'John Test',
        email: 'johntest@gmail.com',
        old_password: '123123',
        password: '123123'
      }
    )).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update the password with right old password', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeHashProvider = new FakeHashProvider();
    const updateProfileService = new UpdateProfileService(fakeUserRepository, fakeHashProvider);

    const user = await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123456'
    });

    const response = await updateProfileService.execute(
      {
        user_id: user.id,
        name: 'John Test',
        email: 'johntest@gmail.com',
        old_password: '123456',
        password: '123123'
      }
    );

    expect(response.password).toBe('123123');
  });
});
