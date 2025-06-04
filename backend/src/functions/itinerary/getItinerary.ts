import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDb, formatResponse } from '/opt/nodejs/utils';
import { ItineraryItem } from '../../models/itinerary';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      TableName: process.env.ITINERARY_TABLE!,
    };

    const { Items } = await dynamoDb.send(new ScanCommand(params));
    
    // Sort items by date
    const sortedItems = Items as ItineraryItem[] || [];
    sortedItems.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      
      // Compare year first, then month, then day
      if (yearA !== yearB) return yearA - yearB;
      if (monthA !== monthB) return monthA - monthB;
      return dayA - dayB;
    });

    return formatResponse(200, sortedItems);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return formatResponse(500, { error: 'Could not fetch itinerary' });
  }
};
