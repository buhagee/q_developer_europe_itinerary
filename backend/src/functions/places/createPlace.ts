import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, formatResponse } from '/opt/nodejs/utils';
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    if (!event.body) {
      return formatResponse(400, { error: 'Request body is required' });
    }

    const placeData = JSON.parse(event.body);
    
    // Validate required fields
    if (!placeData.name || !placeData.city || !placeData.type) {
      return formatResponse(400, { error: 'Name, city, and type are required fields' });
    }

    // Create a new place with a unique ID
    const place = {
      id: uuidv4(),
      name: placeData.name,
      city: placeData.city,
      type: placeData.type,
      description: placeData.description || undefined,
      address: placeData.address || undefined,
      openingHours: placeData.openingHours || undefined,
      website: placeData.website || undefined,
      imageUrl: placeData.imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(placeData.city)},${encodeURIComponent(placeData.name)}`,
      rating: placeData.rating || undefined,
      coordinates: placeData.coordinates || undefined,
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: process.env.PLACES_TABLE!,
      Item: place
    };

    await dynamoDb.send(new PutCommand(params));
    
    return formatResponse(201, place);
  } catch (error) {
    console.error('Error creating place:', error);
    return formatResponse(500, { error: 'Could not create place' });
  }
};
