import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class ImageService {
  async uploadImage(file: Express.Multer.File, folder: 'profiles' | 'stores' | 'products' | 'default' = 'profiles'): Promise<{ url: string }> {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const fileName = file.filename || file.originalname;
    const url = `${baseUrl}/uploads/${folder}/${fileName}`;
    return { url };
  }


async deleteImage(fileUrl: string, folder: 'profiles' | 'stores' | 'products' | 'default' = 'profiles') {
  if (!fileUrl) return;

  try {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) return;

    const filePath = join(process.cwd(), 'uploads', folder, fileName);

    if (!existsSync(filePath)) {
      console.warn(`File does not exist, skipping delete: ${filePath}`);
      return;
    }

    await unlink(filePath);
    console.log(`Deleted image: ${filePath}`);
  } catch (err) {
    console.error('Error deleting image:', err);
  }
}

}
