import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, formatResponse, isValidDate } from '/opt/nodejs/utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const date = event.pathParameters?.date;
    
    if (!date || !isValidDate(date)) {
      return formatResponse(400, { error: 'Invalid date format. Please use DD/MM/YY' });
    }

    const params = {
      TableName: process.env.ITINERARY_TABLE!,
      Key: { date }
    };

    const { Item } = await dynamoDb.send(new GetCommand(params));
    
    if (!Item) {
      return formatResponse(404, { error: 'Itinerary for this date not found' });
    }

    return formatResponse(200, Item);
  } catch (error) {
    console.error('Error fetching itinerary by date:', error);
    return formatResponse(500, { error: 'Could not fetch itinerary for the specified date' });
  }
};
