import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, formatResponse, isValidDate } from '/opt/nodejs/utils';
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return formatResponse(400, { error: 'Missing request body' });
    }

    const { date, content } = JSON.parse(event.body);
    
    if (!date || !isValidDate(date)) {
      return formatResponse(400, { error: 'Invalid date format. Please use DD/MM/YY' });
    }
    
    if (!content || content.trim() === '') {
      return formatResponse(400, { error: 'Note content cannot be empty' });
    }

    const timestamp = new Date().toISOString();
    const note = {
      id: uuidv4(),
      date,
      content,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const params = {
      TableName: process.env.NOTES_TABLE!,
      Item: note
    };

    await dynamoDb.send(new PutCommand(params));

    return formatResponse(201, note);
  } catch (error) {
    console.error('Error creating note:', error);
    return formatResponse(500, { error: 'Could not create note' });
  }
};
