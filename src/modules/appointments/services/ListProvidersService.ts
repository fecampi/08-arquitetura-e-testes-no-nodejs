import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

interface IRequestDTO {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<User[]> {
    // busca do cache
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    // se não encontrar
    if (!users) {
      // carrega usuário
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      // nível:chave
      await this.cacheProvider.save(`providers-list:${user_id}`, users);
    }

    return users;
  }
}
