import {uuid} from 'uuidv4';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';

class FakeUserTokensRepository implements IUsersTokenRepository {
  private user_tokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id
    });

    this.user_tokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUserToken = this.user_tokens.find((userToken => userToken.token === token));

    return findUserToken;
  }
}

export default FakeUserTokensRepository;
