import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Config, UploadResponse, PresignedUrlResponse } from "./types";
import { v4 as uuidv4 } from 'uuid';

export class S3Service {
  private s3Client: S3Client;
  private config: S3Config;

  constructor() {
    this.config = {
      bucketName: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      accessKey: process.env.NEXT_PUBLIC_S3_ACCESS_KEY!,
      secretKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY!,
      region: process.env.NEXT_PUBLIC_S3_REGION!,
      uri: process.env.NEXT_PUBLIC_S3_URI!,
      duration: Number(process.env.NEXT_PUBLIC_S3_DURATION) || 10,
    };

    this.s3Client = new S3Client({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
    });
  }

  async uploadFile(file: Buffer, contentType: string): Promise<UploadResponse> {
    try {
      // Generate UUID for the file key
      const fileKey = uuidv4();
      
      // Determine the file extension based on the content type
      const extension = contentType.split('/')[1];
      const key = `postImages/${fileKey}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
      });

      await this.s3Client.send(command);

      return {
        key,
      };
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  async getPresignedUrl(key: string, contentType: string): Promise<PresignedUrlResponse> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: this.config.duration * 60, // Convert minutes to seconds
      });

      return {
        url,
        key,
        fields: {
          key,
          bucket: this.config.bucketName,
          "Content-Type": contentType,
        },
      };
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      throw new Error("Failed to generate presigned URL");
    }
  }

  async getFileUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: this.config.duration * 60,
      });

      return url;
    } catch (error) {
      console.error("Error generating file URL:", error);
      throw new Error("Failed to generate file URL");
    }
  }
} 