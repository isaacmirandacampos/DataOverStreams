import http from 'node:http';
import fs from 'node:fs';
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
        response.setHeader('Access-Control-Allow-Origin', '*');
        this.get(method, response, async () => {
          if (pathname === '/ping') {
            response.write(JSON.stringify({ now: new Date().toISOString() }));
            response.end();
          }

          if (pathname === '/request-upload-csv') {
            const file = `${crypto.randomUUID()}.csv`;
            const url = await requestASignedUrlBucket(file);
            response.write(JSON.stringify({ url }));
            response.end();
          }

          if (pathname === '/fetch-credentials') {
            await fetch_credentials(request, response);
            response.end();
          }

          if (pathname === '/') {
            response.writeHead(200, {
              'Content-Type': 'text/html',
            });
            const file = fs.createReadStream('src/index.html');

            file.pipe(response);
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
    if (method === 'GET') {
      await callback();
    }
  }
}

export default App;
