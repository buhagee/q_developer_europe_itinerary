const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Build the frontend
console.log('Building the frontend...');
try {
  execSync('npm run build', { 
    cwd: '/home/buhagiar/q_developer_europe_itinerary/frontend',
    stdio: 'inherit'
  });
  console.log('Frontend build completed successfully!');
} catch (error) {
  console.error('Error building frontend:', error.toString());
  process.exit(1);
}

// Deploy to S3
console.log('Deploying to S3...');
try {
  execSync('aws s3 sync build/ s3://europeitineraryappstack-websitebucket75c24d94-9czmeknhpqhb/ --delete', {
    cwd: '/home/buhagiar/q_developer_europe_itinerary/frontend',
    stdio: 'inherit'
  });
  console.log('S3 deployment completed successfully!');
} catch (error) {
  console.error('Error deploying to S3:', error.toString());
  process.exit(1);
}

// Create CloudFront invalidation
console.log('Creating CloudFront invalidation...');
try {
  execSync('aws cloudfront create-invalidation --distribution-id E41HLNTAGYWXZ --paths "/*"', {
    stdio: 'inherit'
  });
  console.log('CloudFront invalidation created successfully!');
} catch (error) {
  console.error('Error creating CloudFront invalidation:', error.toString());
  process.exit(1);
}

console.log('Deployment completed! The website should be available at https://d242yn8pgjfuj.cloudfront.net/');
