import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  // Public pois vai ser acessível por fora da classe
  // Async pois pode demorar
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}
