export interface S3Config {
  bucketName: string;
  accessKey: string;
  secretKey: string;
  region: string;
  uri: string;
  duration: number;
}

export interface UploadResponse {
  key: string;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
  fields: Record<string, string>;
} 