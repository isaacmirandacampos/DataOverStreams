import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://127.0.0.1:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});

export function fetchData() {
  const command = new ScanCommand({
    TableName: 'credentials',
    Limit: 10000,
  });

  return client.send(command);
}
