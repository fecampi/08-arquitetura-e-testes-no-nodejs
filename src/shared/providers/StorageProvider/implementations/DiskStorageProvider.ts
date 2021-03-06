import fs from 'fs';
import path from 'path';

import uploadConfig from '@shared/providers/StorageProvider/StorageProviderConfig';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    // mover o arquivo da temp para uploads
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);
    // Tenta achar
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }
    // se achou move
    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
