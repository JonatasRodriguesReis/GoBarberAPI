import {inject,injectable} from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/users';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '@modules/users/repositories/IUsersTokenRepository';

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

      await this.userTokensRepository.generate(findUser.id);

      this.mailProvider.sendMail(email, 'Pedido de recuperação de senha recebido!');
    }
}

export default SendForgotPasswordEmailService;
