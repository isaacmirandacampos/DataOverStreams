import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localstack:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
});

export function fetchData(identifier: string, page: string) {
  const command = new GetItemCommand({
    TableName: 'credentials',
    Key: {
      identifier: { S: `${identifier}-${page}` },
    },
  });

  return client.send(command);
}
