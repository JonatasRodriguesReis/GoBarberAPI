import { Repository, getRepository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/users';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateDTO';
class UserRepository implements IUsersRepository {

  private ormRepository: Repository<User>;

  constructor(){
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { id } });

    return user || undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user || undefined;
  }

  public async create({name,email,password}: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({name,email,password});

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    await this.ormRepository.save(user);

    return user;
  }

  /* public async findByEmail(email: string): Promise<User | null> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user || null;
  } */
}

export default UserRepository;
