import http from 'node:http';
import { requestASignedUrlBucket } from './s3';
import { fetch_credentials } from './fetch_credentials';

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

          if (pathname === '/fetch-credentials') {
            await fetch_credentials(request, response);
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

  private async get(
    method: string,
    response: http.ServerResponse,
    callback: () => Promise<void>,
  ) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    if (method === 'GET') {
      await callback();
    }
    response.end();
  }
}

export default App;
