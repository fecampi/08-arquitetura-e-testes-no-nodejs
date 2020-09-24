import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUsersRepository {
  // encontrar nome
  findById(id: string): Promise<User | undefined>;
  // encontrar por e-mail
  findByEmail(email: string): Promise<User | undefined>;
  // criar usuário recebendo o objeto
  create(data: ICreateUserDTO): Promise<User>;
  // salvar usuário no banco
  save(user: ICreateUserDTO): Promise<User>;
}
