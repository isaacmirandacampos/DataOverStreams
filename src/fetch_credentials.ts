import { IncomingMessage, ServerResponse } from 'node:http';
import { fetchData } from './dynamodb';
export async function fetch_credentials(
  _request: IncomingMessage,
  response: ServerResponse,
) {
  const result = await fetchData();
  if (!result.Items) {
    response.write(JSON.stringify([]));
    return;
  }
  const rows = result.Items.map(item => ({
    identifier_code: item.identifier_code.S,
    name: item.name.S,
  }));
  response.write(JSON.stringify(rows));
}
