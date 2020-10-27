export default interface IStorageProvider {
  // salva e devolve o caminho completo
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
