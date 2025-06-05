const { execSync } = require('child_process');

// Get the Lambda function name
const lambdaFunctionName = 'EuropeItineraryAppStack-GetItineraryFunctionD3E11E-EYCkEZrV52bw';

// Update the Lambda function environment variables
console.log(`Updating Lambda function ${lambdaFunctionName} environment variables...`);
try {
  execSync(`aws lambda update-function-configuration --function-name ${lambdaFunctionName} --region ap-southeast-2 --environment "Variables={ITINERARY_TABLE=EuropeItineraryAppStack-ItineraryTable5E30CEE2-1CJXG0IYPE95E}"`);
  console.log('Lambda function environment variables updated successfully!');
} catch (error) {
  console.error('Error updating Lambda function environment variables:', error.toString());
}
