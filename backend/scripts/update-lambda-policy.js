const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Role name
const roleName = 'EuropeItineraryAppStack-GetItineraryFunctionService-2hJQR7S5RrzU';

// Create a policy document
const policyDocument = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:BatchGetItem',
        'dynamodb:ConditionCheckItem',
        'dynamodb:DescribeTable',
        'dynamodb:GetItem',
        'dynamodb:GetRecords',
        'dynamodb:GetShardIterator',
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:PutItem'
      ],
      Resource: [
        'arn:aws:dynamodb:ap-southeast-2:335412102386:table/EuropeItineraryAppStack-ItineraryTable5E30CEE2-1CJXG0IYPE95E'
      ]
    }
  ]
};

// Write the policy document to a temporary file
const policyFile = path.join(__dirname, 'policy.json');
fs.writeFileSync(policyFile, JSON.stringify(policyDocument));

// Update the inline policy
console.log(`Updating inline policy for role ${roleName}...`);
try {
  execSync(`aws iam put-role-policy --role-name ${roleName} --policy-name GetItineraryFunctionServiceRoleDefaultPolicy4CC2CA67 --policy-document file://${policyFile}`);
  console.log('Inline policy updated successfully!');
} catch (error) {
  console.error('Error updating inline policy:', error.toString());
}

// Clean up
fs.unlinkSync(policyFile);
console.log('Cleanup completed!');
