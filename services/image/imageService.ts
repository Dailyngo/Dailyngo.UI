import sharp from 'sharp';
import { S3Service } from '../s3/s3Service';

export class ImageService {
  private s3Service: S3Service;

  constructor() {
    this.s3Service = new S3Service();
  }

  async processAndUploadImage(file: Buffer, fileName: string): Promise<string> {
    try {
      // Process image to make it square
      const processedImage = await this.makeImageSquare(file);
      
      // Upload to S3
      const result = await this.s3Service.uploadFile(
        processedImage,
        'image/jpeg'
      );

      return result.key;
    } catch (error) {
      console.error('Error processing and uploading image:', error);
      throw new Error('Failed to process and upload image');
    }
  }

  private async makeImageSquare(buffer: Buffer): Promise<Buffer> {
    try {
      // Get image metadata
      const metadata = await sharp(buffer).metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image dimensions');
      }

      // Calculate dimensions for square crop
      const size = Math.min(metadata.width, metadata.height);
      const left = Math.floor((metadata.width - size) / 2);
      const top = Math.floor((metadata.height - size) / 2);

      // Process image
      return await sharp(buffer)
        .extract({
          left,
          top,
          width: size,
          height: size,
        })
        .resize(800, 800, { // Resize to 800x800
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
        .toBuffer();
    } catch (error) {
      console.error('Error making image square:', error);
      throw new Error('Failed to process image');
    }
  }
} 