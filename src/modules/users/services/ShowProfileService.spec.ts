import 'reflect-metadata';
import ShowProfileService from '../services/ShowProfileService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

describe('ShowUpdateProfile', () => {
  it('Should be able to show a user profile', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const showProfileService = new ShowProfileService(fakeUserRepository);

    const user =  await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123123'
    })

    const showUser = await showProfileService.execute(
      {
        user_id: user.id
      }
    );

    expect(showUser.name).toBe('John Doe');
    expect(showUser.email).toBe('john@gmail.com');
  });

  it('Should not be able to show a non-existing user profile', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const showProfileService = new ShowProfileService(fakeUserRepository);

    await expect(showProfileService.execute(
      {
        user_id: 'non-existing user'
      }
    )).rejects.toBeInstanceOf(AppError);
  });
});
