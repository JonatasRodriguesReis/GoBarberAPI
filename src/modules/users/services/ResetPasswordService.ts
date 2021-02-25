import {inject,injectable} from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/users';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '@modules/users/repositories/IUsersTokenRepository';

interface IRequest {
    password: string;
    token: string;
}

@injectable()
class ResetPassordService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository

  ) {}

    public async execute({ password, token }: IRequest): Promise<void> {
      const userToken = await this.userTokensRepository.findByToken(token);

      if(!userToken)
        throw new Error('User token does not exists!');

      const user = await this.usersRepository.findById(userToken.user_id);

      if(!user)
        throw new Error('User does not exits');

      user.password = password;

      await this.usersRepository.save(user);
    }
}

export default ResetPassordService;
