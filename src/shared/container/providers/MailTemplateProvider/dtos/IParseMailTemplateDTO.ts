interface ITemplateVariables {
  // Um objeto string  para poder receber uma string ou number
  [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
