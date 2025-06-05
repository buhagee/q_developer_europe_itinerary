const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

// Helper function to format response
const formatResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
    },
    body: JSON.stringify(body),
  };
};

exports.handler = async (event) => {
  try {
    console.log('Fetching itinerary items from DynamoDB');
    const params = {
      TableName: process.env.ITINERARY_TABLE,
    };

    console.log('Table name:', process.env.ITINERARY_TABLE);
    const result = await dynamoDb.send(new ScanCommand(params));
    console.log(`Retrieved ${result.Items?.length || 0} items from DynamoDB`);
    
    // Sort items by date
    const sortedItems = result.Items || [];
    sortedItems.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      
      // Compare year first, then month, then day
      if (yearA !== yearB) return yearA - yearB;
      if (monthA !== monthB) return monthA - monthB;
      return dayA - dayB;
    });

    console.log(`Returning ${sortedItems.length} sorted items`);
    return formatResponse(200, sortedItems);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return formatResponse(500, { error: 'Could not fetch itinerary' });
  }
};
