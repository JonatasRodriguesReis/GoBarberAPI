import { getCustomRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import {inject,injectable} from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import uploadconfig from '../../../config/upload';
import User from '../infra/typeorm/entities/users';
import AppError from '../../../shared/errors/AppError';

interface IRequest {
    userId: string;
    avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor (@inject('UsersRepository') private usersRepository: IUsersRepository, @inject('StorageProvider') private storageProvider: IStorageProvider
  ) {}
    public async execute({ userId, avatarFileName }: IRequest): Promise<User> {

        const findUser = await this.usersRepository.findById(userId);

        if (!findUser) throw new AppError('User does not exist!', 401);

        if (findUser.avatar) {
          await this.storageProvider.deleteFile(findUser.avatar);
        }

        await this.storageProvider.saveFile(findUser.avatar);

        findUser.avatar = avatarFileName;
        await this.usersRepository.save(findUser);
        //delete findUser.password;

        return findUser;
    }
}

export default UpdateUserAvatarService;
