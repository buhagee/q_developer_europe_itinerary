import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, formatResponse, isValidDate } from '/opt/nodejs/utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const date = event.queryStringParameters?.date;
    
    // If date is provided, query by date
    if (date) {
      if (!isValidDate(date)) {
        return formatResponse(400, { error: 'Invalid date format. Please use DD/MM/YY' });
      }

      const params = {
        TableName: process.env.NOTES_TABLE!,
        IndexName: 'DateIndex',
        KeyConditionExpression: '#date = :date',
        ExpressionAttributeNames: {
          '#date': 'date',
        },
        ExpressionAttributeValues: {
          ':date': date,
        },
      };

      const { Items } = await dynamoDb.send(new QueryCommand(params));
      return formatResponse(200, Items || []);
    } 
    
    // Otherwise, return all notes
    const params = {
      TableName: process.env.NOTES_TABLE!,
    };

    const { Items } = await dynamoDb.send(new ScanCommand(params));
    return formatResponse(200, Items || []);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return formatResponse(500, { error: 'Could not fetch notes' });
  }
};
