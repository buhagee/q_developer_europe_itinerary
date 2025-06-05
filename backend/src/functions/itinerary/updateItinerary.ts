import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, formatResponse, isValidDate } from '/opt/nodejs/utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const date = event.pathParameters?.date;
    
    if (!date || !isValidDate(date)) {
      return formatResponse(400, { error: 'Invalid date format. Please use DD/MM/YY' });
    }

    // Parse request body
    if (!event.body) {
      return formatResponse(400, { error: 'Request body is required' });
    }

    const updateData = JSON.parse(event.body);
    
    // Check if the item exists
    const getParams = {
      TableName: process.env.ITINERARY_TABLE!,
      Key: { date }
    };

    const { Item } = await dynamoDb.send(new GetCommand(getParams));
    
    if (!Item) {
      return formatResponse(404, { error: 'Itinerary for this date not found' });
    }

    // Build update expression and attribute values
    let updateExpression = 'SET';
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};
    
    // Only update fields that are provided
    if (updateData.location !== undefined) {
      updateExpression += ' #location = :location,';
      expressionAttributeValues[':location'] = updateData.location;
      expressionAttributeNames['#location'] = 'location';
    }
    
    if (updateData.activities !== undefined) {
      updateExpression += ' activities = :activities,';
      expressionAttributeValues[':activities'] = updateData.activities;
    }
    
    if (updateData.accommodation !== undefined) {
      updateExpression += ' accommodation = :accommodation,';
      expressionAttributeValues[':accommodation'] = updateData.accommodation;
    }
    
    if (updateData.travel !== undefined) {
      updateExpression += ' travel = :travel,';
      expressionAttributeValues[':travel'] = updateData.travel;
    }
    
    if (updateData.food !== undefined) {
      updateExpression += ' food = :food,';
      expressionAttributeValues[':food'] = updateData.food;
    }
    
    // Remove trailing comma
    updateExpression = updateExpression.slice(0, -1);
    
    // If no fields to update
    if (Object.keys(expressionAttributeValues).length === 0) {
      return formatResponse(400, { error: 'No valid fields to update' });
    }

    const params = {
      TableName: process.env.ITINERARY_TABLE!,
      Key: { date },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDb.send(new UpdateCommand(params));
    
    return formatResponse(200, result.Attributes);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return formatResponse(500, { error: 'Could not update itinerary' });
  }
};
