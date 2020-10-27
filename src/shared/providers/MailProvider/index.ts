import { container } from 'tsyringe';

import mailConfig from '@shared/providers/MailProvider/MailProviderConfig';
import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

// Escolhe o provider de e-mail, de acordo com a configuração
const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
  // criando um novo provider, só adicionar abaixo
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
