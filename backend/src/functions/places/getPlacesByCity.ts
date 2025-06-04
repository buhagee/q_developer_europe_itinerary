import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, formatResponse } from '/opt/nodejs/utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const city = event.pathParameters?.city;
    
    if (!city) {
      return formatResponse(400, { error: 'City parameter is required' });
    }

    const params = {
      TableName: process.env.PLACES_TABLE!,
      IndexName: 'CityIndex',
      KeyConditionExpression: 'city = :city',
      ExpressionAttributeValues: {
        ':city': city,
      },
    };

    const { Items } = await dynamoDb.send(new QueryCommand(params));
    
    if (!Items || Items.length === 0) {
      return formatResponse(404, { error: `No places found for city: ${city}` });
    }

    return formatResponse(200, Items);
  } catch (error) {
    console.error('Error fetching places by city:', error);
    return formatResponse(500, { error: 'Could not fetch places for the specified city' });
  }
};
