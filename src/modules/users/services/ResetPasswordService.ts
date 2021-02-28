import {inject,injectable} from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUsersTokenRepository';
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider';
import {isAfter, addHours} from 'date-fns';

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
    private userTokensRepository: IUserTokensRepository,

    @inject('IHashProvider')
    private hashProvider: IHashProvider

  ) {}

    public async execute({ password, token }: IRequest): Promise<void> {
      const userToken = await this.userTokensRepository.findByToken(token);

      if(!userToken)
        throw new Error('User token does not exists!');

      const user = await this.usersRepository.findById(userToken.user_id);

      if(!user)
        throw new Error('User does not exits');

      const tokenCreatedAt = userToken.created_at;
      const compareDate = addHours(tokenCreatedAt, 2);

      if(isAfter(Date.now(), compareDate))
        throw new Error('Token expired');

      user.password = await this.hashProvider.generateHash(password);

      await this.usersRepository.save(user);
    }
}

export default ResetPassordService;
