import 'reflect-metadata';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserRepository from '@modules/users/repositories/Fakes/FakeUsersRepository';
import FakeEmailProvider from '@shared/container/providers/MailProvider/fakes/FakeEmailProvider';
import FakeUserTokenRepository from '@modules/users/repositories/Fakes/FakeUserTokensRepository';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeEmailProvider: FakeEmailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {

  beforeEach(()=>{
    fakeUserRepository = new FakeUserRepository();
    fakeEmailProvider = new FakeEmailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeEmailProvider,
      fakeUserTokenRepository
    );
  })

  it('Should be able to recover the password using the email', async () => {

    const sendEmail = jest.spyOn(fakeEmailProvider, 'sendMail');

    const user =  await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123123'
    });

    const response = await sendForgotPasswordEmailService.execute({email:"john@gmail.com"});

    expect(sendEmail).toHaveBeenCalled();
  });

  it('Should not be able to recover to a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute(
        {email:"john@gmail.com"})
      ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to generate a forgot password token', async () => {

    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeEmailProvider,
      fakeUserTokenRepository
    );

    const user = await fakeUserRepository.create({
      email: 'john@gmail.com',
      name: "John Doe",
      password: '123123'
    });

    await sendForgotPasswordEmailService.execute({email:"john@gmail.com"});

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
