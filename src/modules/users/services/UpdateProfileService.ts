import {inject,injectable} from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entities/users';
import AppError from '@shared/errors/AppError';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}
    public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {
      const user = await this.usersRepository.findById(user_id);

      if(!user){
        throw new AppError('User not found!');
      }

      const userWithSameUpdatedEmail = await this.usersRepository.findByEmail(email);

      if(userWithSameUpdatedEmail && userWithSameUpdatedEmail.id !== user.id){
        throw new AppError('E-mail already in use');
      }

      if(password){

        if(!old_password)
          throw new AppError('Password can not be changed without old password');

        const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

        if(!checkOldPassword)
          throw new AppError('It not possible to change password with wrong old password');

        user.password = await this.hashProvider.generateHash(password);
      }

      user.name = name;
      user.email = email;

      return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
