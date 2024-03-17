import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const BUCKET = 'credentials';

const client = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://127.0.0.1:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});

export async function requestSignedUrlToSendFile(file: string) {
  const expiresIn = 60 * 60; // 1 hour
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: file,
  });

  return getSignedUrl(client, command, { expiresIn });
}
