import { FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import { requestSignedUrlToSendFile } from '../shared/s3';

export async function requestUploadCsv(
  _req: FastifyRequest,
  res: FastifyReply,
) {
  const file = `${crypto.randomUUID()}.csv`;
  const url = await requestSignedUrlToSendFile(file);
  res.status(200).send({ url });
}
