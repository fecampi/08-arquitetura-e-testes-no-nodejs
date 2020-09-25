export default interface IHashProvider {
  // Gerar
  generateHash(payload: string): Promise<string>;
  // Comparar
  compareHash(payload: string, hashed: string): Promise<boolean>;
}
