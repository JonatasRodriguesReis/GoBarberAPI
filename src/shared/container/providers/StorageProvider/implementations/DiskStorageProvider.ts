import fs from 'fs';
import path from 'path';
import uploadsConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';


class DiskStorageProvider implements IStorageProvider{
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadsConfig.tmpFolder, file),
      path.resolve(uploadsConfig.uploadsFolder, file)
    );

    return file;
  }
  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadsConfig.uploadsFolder, file);

    try{
      await fs.promises.stat(filePath);
    }catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }

}

export default DiskStorageProvider;
