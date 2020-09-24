import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../../../models/User';

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
