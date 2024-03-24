import http from 'node:http';
import { requestASignedUrlBucket } from './s3';

class App {
  server: http.Server;
  constructor() {
    this.server = http.createServer();
  }

  public async mountRoutes() {
    this.server.on(
      'request',
      async (request: http.IncomingMessage, response: http.ServerResponse) => {
        const { method, pathname } = this.requestContext(request);
        this.get(method, response, async () => {
          if (pathname === '/ping') {
            response.write(JSON.stringify({ now: new Date().toISOString() }));
          }

          if (pathname === '/request-upload-csv') {
            const file = `${crypto.randomUUID()}.csv`;
            const url = await requestASignedUrlBucket(file);
            response.write(JSON.stringify({ url }));
          }
        });
      },
    );
  }

  private requestContext(request: http.IncomingMessage) {
    if (!request.method || !request.url) throw new Error('Invalid request');
    return {
      method: request.method,
      pathname: request.url,
    };
  }

  private get(
    method: string,
    response: http.ServerResponse,
    callback: () => void,
  ) {
    if (method === 'GET') {
      callback();
    }
    response.end();
  }
}

export default App;
