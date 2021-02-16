import 'reflect-metadata';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

describe('UpdateUserAvatar', () => {
  it('Should be able to update a user avatar', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

    const user =  await fakeUserRepository.create({
      email: 'John@gmail.com',
      name: "John Doe",
      password: '123123'
    })

    const response = await updateUserAvatar.execute(
      {
        userId: user.id,
        avatarFileName: 'avatar.jpg'
      }
    );

    expect(response.avatar).toBe('avatar.jpg');
  });

  it('Should not be able to update avatar of a non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

    expect(updateUserAvatar.execute(
      {
        userId: '123123',
        avatarFileName: 'avatar.jpg'
      }
    )).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to delete old avatar when update a new one', async () => {
    const fakeUserRepository = new FakeUserRepository();

    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user =  await fakeUserRepository.create({
      email: 'John@gmail.com',
      name: "John Doe",
      password: '123123'
    });

    await updateUserAvatar.execute(
      {
        userId: user.id,
        avatarFileName: 'avatarold.jpg'
      }
    );

    const response = await updateUserAvatar.execute(
      {
        userId: user.id,
        avatarFileName: 'avatar.jpg'
      }
    );

    expect(deleteFile).toHaveBeenCalled();
    expect(response.avatar).toBe('avatar.jpg');
  });
});
