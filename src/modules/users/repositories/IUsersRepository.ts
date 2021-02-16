import User from '../infra/typeorm/entities/users';
import ICreateUserDTO from '../dtos/ICreateDTO';

export default interface IUsersRepository{
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
