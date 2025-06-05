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
    console.log('Fetching places from DynamoDB');
    const params = {
      TableName: process.env.PLACES_TABLE,
    };

    console.log('Table name:', process.env.PLACES_TABLE);
    const result = await dynamoDb.send(new ScanCommand(params));
    console.log(`Retrieved ${result.Items?.length || 0} places from DynamoDB`);
    
    return formatResponse(200, result.Items || []);
  } catch (error) {
    console.error('Error fetching places:', error);
    return formatResponse(500, { error: 'Could not fetch places' });
  }
};
