import fastify, { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { routes } from './routes';

class App {
  server: FastifyInstance;
  constructor() {
    this.server = fastify({
      bodyLimit: 20000000, // near to 20MB
      genReqId: () => crypto.randomUUID(),
    });

    this.applyGlobalHooks();
  }

  protected applyGlobalHooks() {
    this.server.addHook('onRoute', params => {
      console.info(`${params.method} ${params.url}`);
    });
  }

  public async mountRoutes() {
    this.server.register(async (instance, _opts, done) => {
      routes(instance);
      done();
    });
  }
}

export default App;
