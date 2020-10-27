import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  // Informação composta na entrada vale a pena criar um DTO
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
