import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({});
export const dynamoDb = DynamoDBDocumentClient.from(client);

// Helper function to format response
export const formatResponse = (statusCode: number, body: any) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
};

// Helper function to parse date string to standard format
export const parseDate = (dateString: string): string => {
  // Input format: DD/MM/YY
  const [day, month, year] = dateString.split('/');
  return `${day}/${month}/${year}`;
};

// Helper function to format date for display
export const formatDateForDisplay = (dateString: string): string => {
  // Input format: DD/MM/YY
  const [day, month, year] = dateString.split('/');
  const date = new Date(`20${year}-${month}-${day}`);
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Helper function to validate date format
export const isValidDate = (dateString: string): boolean => {
  // Check if format is DD/MM/YY
  const regex = /^\d{2}\/\d{2}\/\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(`20${year}-${month}-${day}`);
  
  return date.getDate() === day && 
         date.getMonth() + 1 === month && 
         date.getFullYear() === 2000 + year;
};
