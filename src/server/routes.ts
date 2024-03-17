import { FastifyInstance, FastifyReply, RawServerDefault } from 'fastify';
import { requestUploadCsv } from '../modules/request-upload-csv';

type Instance = FastifyInstance<RawServerDefault>;
export function routes(instance: Instance) {
  instance.get('/ping', async (_req, res: FastifyReply) => {
    res.send({ now: new Date().toISOString() });
  });

  instance.get('/request-upload-csv', requestUploadCsv);
}
