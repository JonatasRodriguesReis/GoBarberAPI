import 'reflect-metadata';
import ResetPasswordService from './ResetPasswordService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUsersRepository';
import FakeUserTokenRepository from '@modules/users/repositories/Fakes/FakeUserTokensRepository';
import FakeHashPassword from '@modules/users/providers/HashProviders/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashPassword;

describe('ResetPassword', () => {

  beforeEach(()=>{
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashPassword();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository, fakeUserTokenRepository, fakeHashProvider
    );
  })

  it('Should be able to reset the password', async () => {

    const user =  await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123123'
    });

    const {token} = await fakeUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({password:'123456', token});

    const findUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalled();
    expect(findUser?.password).toBe('123456');
  });

  it('Should not be able to reset the password to non-existing token', async () => {
    await expect(resetPasswordService.execute({password:'123456', token:'no-existing token'})).rejects.toBeInstanceOf(Error);
  });

  it('Should be able to reset the password', async () => {

    const {token} = await fakeUserTokenRepository.generate('no-existing-user');

    await expect(resetPasswordService.execute({password:'123456', token})).rejects.toBeInstanceOf(Error);
  });

  it('Should not be able to reset the password if passed more than 2 hours', async () => {

    const user =  await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123123'
    });

    const {token} = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(resetPasswordService.execute({password:'123456', token})).rejects.toBeInstanceOf(Error);
  });
});
