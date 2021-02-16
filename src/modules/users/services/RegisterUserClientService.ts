import { getRepository } from 'typeorm';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';
import {inject,injectable} from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/users';
import AppError from '../../../shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserClientService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const findUserbyEmail = await this.usersRepository.findByEmail(email);
        if (findUserbyEmail) {
            throw new AppError(
                "It's not possible register user. E-mail is already existing!",
            );
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        });

        return user;
    }
}

export default CreateUserClientService;
