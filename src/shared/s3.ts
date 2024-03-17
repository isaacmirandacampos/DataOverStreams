import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const BUCKET = 'credentials';

const client = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://127.0.0.1:4566',
  credentials: {
    accessKeyId: '123',
    secretAccessKey: '123',
  },
});

export async function requestSignedUrlToSendFile(file: string) {
  const expiresIn = 60 * 60; // 1 hour
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: file,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export async function getObject(file: string): Promise<Readable | undefined> {
  const response = await client.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: file,
    }),
  );
  if (!response.Body) return undefined;
  return response.Body as Readable;
}
