import http from 'node:http';
import fs from 'node:fs';
import { requestASignedUrlBucket } from './s3';
import { fetchData } from './dynamodb';

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
        this.get(method, async () => {
          if (pathname === '/ping') {
            response.write(JSON.stringify({ now: new Date().toISOString() }));
            response.end();
          }

          if (pathname === '/request-upload-csv') {
            const uuid = crypto.randomUUID();
            const file = `${uuid}.csv`;
            const url = await requestASignedUrlBucket(file);
            response.write(JSON.stringify({ identifier: uuid, url }));
            response.end();
          }

          if (pathname.includes('/fetch-credentials')) {
            const identifier = pathname.split('/')[2].split('?')[0];
            const query = request.url!.split('?')[1];
            const queryParameters = new URLSearchParams(query);
            const page = queryParameters.get('page') || '0';
            const { Item } = await fetchData(identifier, page);
            const result = Item ? Item.payload.S : JSON.stringify([]);
            response.write(result);
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
    callback: () => Promise<void>,
  ) {
    if (method === 'GET') {
      await callback();
    }
  }
}

export default App;
