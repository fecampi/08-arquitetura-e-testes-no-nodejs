import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
// Precisa criptografar na atualização
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  // Obrigatório o id, nome e email.
  user_id: string;
  name: string;
  email: string;
  // Opcional, pois ele pode ou não atualizar a senha
  old_password?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    // Se não existe
    if (!user) {
      throw new AppError('User not found.');
    }

    // confere se já existe algum usuário com esse e-mail, desde que não seja o do próprio usuário
    const checkEmail = await this.usersRepository.findByEmail(email);

    if (checkEmail && checkEmail.id !== user_id) {
      throw new AppError('This email is already used by another user.');
    }

    // Senha tem que ser diferente da antiga
    if (password && !old_password) {
      throw new AppError('You need to inform the current password.');
    }
    // Se informou como senha antiga uma senha errada gera errada
    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Wrong current password.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    // OK, recebe e salva o usuário
    user.name = name;
    user.email = email;
    // Não precisa colocar await no return pois a função já é assíncrona
    return this.usersRepository.save(user);
  }
}
