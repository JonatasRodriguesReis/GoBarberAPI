import 'reflect-metadata';
import ResetPasswordService from './ResetPasswordService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUsersRepository';
import FakeUserTokenRepository from '@modules/users/repositories/Fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let resetPasswordService: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {

  beforeEach(()=>{
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository, fakeUserTokenRepository
    );
  })

  it('Should be able to reset the password', async () => {

    const user =  await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123123'
    });

    const {token} = await fakeUserTokenRepository.generate(user.id);

    await resetPasswordService.execute({password:'123456', token});

    const findUser = await fakeUserRepository.findById(user.id);

    expect(findUser?.password).toBe('123456');
  });
});
