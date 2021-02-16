import { getCustomRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';
import {inject,injectable} from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../infra/typeorm/entities/users';
import AppError from '../../../shared/errors/AppError';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    token: string;
    user: User
}

@injectable()
class AuthenticateService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}
    public async execute({ email, password }: IRequest): Promise<IResponse> {

        const findUserbyEmail = await this.usersRepository.findByEmail(email);

        if (!findUserbyEmail) {
            throw new AppError('E-mail do not existing!', 401);
        }

        const passwordCompare = this.hashProvider.compareHash(password, findUserbyEmail.password);

        if (!passwordCompare) {
            throw new AppError('E-mail or password are wrong!');
        }

        const token = sign({}, 'abefb954fa4045120503e5595ecb8879', {
            subject: findUserbyEmail.id,
            expiresIn: '1d',
        });

        return { user: findUserbyEmail,token };
    }
}

export default AuthenticateService;
