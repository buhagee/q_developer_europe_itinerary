const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the Lambda function code
const lambdaFunctionPath = path.join(__dirname, '../src/functions/itinerary');

// Path to the CSV file
const csvFilePath = '/home/buhagiar/europe_itinerary.csv';

// Create a temporary directory for deployment package
const tempDir = path.join(__dirname, 'temp-deploy');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Copy the Lambda function code to the temp directory
console.log('Copying Lambda function code...');
execSync(`cp -r ${lambdaFunctionPath}/* ${tempDir}/`);

// Create a seed-data.js file in the temp directory
console.log('Creating seed-data.js file...');
const csvData = fs.readFileSync(csvFilePath, 'utf8');

const seedDataContent = `
// This file is auto-generated for seeding the database
const csvData = \`${csvData}\`;

// Parse the CSV data
const parseItinerary = (csvData) => {
  const lines = csvData.trim().split('\\n');
  return lines.map(line => {
    const [date, location, food, activities, accommodation, travel] = line.split('\\t');
    return {
      date,
      location,
      food: food || undefined,
      activities: activities || undefined,
      accommodation: accommodation || undefined,
      travel: travel || undefined
    };
  });
};

// Export the parsed itinerary
module.exports = {
  itineraryData: parseItinerary(csvData)
};
`;

fs.writeFileSync(path.join(tempDir, 'seed-data.js'), seedDataContent);

// Create utils.js file in the temp directory
console.log('Creating utils.js file...');
const utilsContent = `
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

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
    },
    body: JSON.stringify(body),
  };
};

module.exports = {
  dynamoDb,
  formatResponse
};
`;

fs.writeFileSync(path.join(tempDir, 'utils.js'), utilsContent);

// Modify the getItinerary.ts file to use the seed data
console.log('Creating CommonJS version of getItinerary.js...');
const getItineraryContent = `
const { ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const utils = require('./utils');
const dynamoDb = utils.dynamoDb;
const formatResponse = utils.formatResponse;

// Import the seed data
const { itineraryData } = require('./seed-data');

// Function to seed the database
const seedDatabase = async () => {
  console.log('Seeding database with itinerary data...');
  
  try {
    for (const item of itineraryData) {
      await dynamoDb.send(new PutCommand({
        TableName: process.env.ITINERARY_TABLE,
        Item: item
      }));
    }
    console.log('Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

exports.handler = async (event) => {
  try {
    // Check if we need to seed the database (query parameter)
    const queryParams = event.queryStringParameters || {};
    if (queryParams.seed === 'true') {
      await seedDatabase();
    }
    
    const params = {
      TableName: process.env.ITINERARY_TABLE,
    };

    const { Items } = await dynamoDb.send(new ScanCommand(params));
    
    // Sort items by date
    const sortedItems = Items || [];
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
`;

fs.writeFileSync(path.join(tempDir, 'getItinerary.js'), getItineraryContent);

// Create a package.json file for the deployment package
console.log('Creating package.json for deployment...');
const packageJsonContent = `
{
  "name": "itinerary-function",
  "version": "1.0.0",
  "description": "Lambda function for itinerary with seeding capability",
  "main": "getItinerary.js",
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.823.0",
    "@aws-sdk/lib-dynamodb": "^3.823.0"
  }
}
`;

fs.writeFileSync(path.join(tempDir, 'package.json'), packageJsonContent);

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { cwd: tempDir });

// Create a zip file for deployment
console.log('Creating deployment package...');
const zipFilePath = path.join(__dirname, 'lambda-deploy.zip');
execSync(`cd ${tempDir} && zip -r ${zipFilePath} .`);

// Get the Lambda function name
console.log('Getting Lambda function name...');
const lambdaFunctionName = 'EuropeItineraryAppStack-GetItineraryFunctionD3E11E-EYCkEZrV52bw';

// Update the Lambda function
console.log(`Updating Lambda function ${lambdaFunctionName}...`);
try {
  execSync(`aws lambda update-function-code --function-name ${lambdaFunctionName} --zip-file fileb://${zipFilePath} --region ap-southeast-2`);
  console.log('Lambda function updated successfully!');
} catch (error) {
  console.error('Error updating Lambda function:', error.toString());
}

// Clean up
console.log('Cleaning up...');
execSync(`rm -rf ${tempDir}`);
execSync(`rm ${zipFilePath}`);

console.log('Deployment completed!');
