import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, formatResponse } from '/opt/nodejs/utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      TableName: process.env.PLACES_TABLE!,
    };

    const { Items } = await dynamoDb.send(new ScanCommand(params));
    return formatResponse(200, Items || []);
  } catch (error) {
    console.error('Error fetching places:', error);
    return formatResponse(500, { error: 'Could not fetch places' });
  }
};
