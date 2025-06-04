# Europe Travel Itinerary App

A personal travel companion application for a European adventure from June 18 to August 3, 2025. This application helps you keep track of your itinerary, discover places to visit, take notes, and access useful travel resources.

## Architecture

This project follows AWS best practices with a serverless architecture:

### Backend
- **AWS Lambda** - Serverless functions for API endpoints
- **Amazon API Gateway** - RESTful API interface
- **Amazon DynamoDB** - NoSQL database for storing itinerary, places, and notes
- **AWS CDK** - Infrastructure as code for deployment

### Frontend
- **React** - Modern UI library with functional components and hooks
- **Material-UI** - Component library for responsive design
- **React Router** - Navigation between pages
- **Amazon S3** - Static website hosting
- **Amazon CloudFront** - Content delivery network

## Features

- **Itinerary Management**: View your complete travel schedule with activities, accommodations, and transportation details
- **Places of Interest**: Explore attractions, restaurants, and accommodations for each city
- **Interactive Map**: Visualize your journey with an interactive map showing all destinations
- **Travel Notes**: Add personal notes and reminders for each day of your trip
- **Travel Resources**: Access useful travel information, language phrases, and emergency contacts

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- AWS CLI configured with appropriate credentials
- AWS CDK installed globally (`npm install -g aws-cdk`)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Deploy the infrastructure:
   ```
   cd infrastructure
   npm install
   cdk deploy
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your API endpoint:
   ```
   REACT_APP_API_URL=<Your API Gateway URL>
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Build for production:
   ```
   npm run build
   ```

## Deployment

The application is deployed using AWS CDK, which provisions all necessary resources:

1. DynamoDB tables for data storage
2. Lambda functions for API endpoints
3. API Gateway for RESTful API
4. S3 bucket for frontend hosting
5. CloudFront distribution for content delivery

## Cost Optimization

This project is designed to be cost-effective for personal use:

- **Pay-per-request** pricing model for DynamoDB
- **Lambda functions** with minimal memory allocation
- **CloudFront** with Price Class 100 (North America and Europe only)
- No provisioned capacity or always-on resources
- Data retention policies to minimize storage costs

## Future Enhancements

- Offline support with local storage
- Push notifications for travel reminders
- Currency converter
- Weather forecasts for each location
- Public transportation information
- Photo gallery for trip memories
