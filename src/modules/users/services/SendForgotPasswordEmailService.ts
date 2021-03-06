import {inject, injectable} from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/users';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '@modules/users/repositories/IUsersTokenRepository';
import {resolve} from 'path';

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository

  ) {}

    public async execute({ email }: IRequest): Promise<void> {
      const findUser = await this.usersRepository.findByEmail(email);

      if(!findUser) throw new AppError("E-mail user doesn't exists!");

      const {token} = await this.userTokensRepository.generate(findUser.id);

      const forgotPasswordTemplate = resolve(__dirname, '..','views' ,'forgot_password.hbs')

      this.mailProvider.sendMail({
        to:{
          name: findUser.name,
          email: findUser.email
        },
        subject: '[GoBarber] Recuperação de senha',
        templateData:{
          file: forgotPasswordTemplate,
          variables: {
            name: findUser.name,
            link: `http://localhost:3000/reset_password?token=${token}`
          }
        }
      });
    }
}

export default SendForgotPasswordEmailService;
