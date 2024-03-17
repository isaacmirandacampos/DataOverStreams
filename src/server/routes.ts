import { FastifyInstance, FastifyReply, RawServerDefault } from 'fastify';

type Instance = FastifyInstance<RawServerDefault>;
export function routes(instance: Instance) {
  instance.get('/ping', async (_req, res: FastifyReply) => {
    res.send({ now: new Date().toISOString() });
  });
}
