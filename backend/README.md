# Europe Itinerary App - Backend

This is the backend for the Europe Itinerary App, a serverless application built with AWS CDK.

## Project Structure

- `infrastructure/` - CDK infrastructure code
- `src/` - Lambda function code
  - `functions/` - Lambda functions for API endpoints
  - `layers/` - Shared code used across Lambda functions
  - `models/` - TypeScript interfaces and types
- `scripts/` - Utility scripts

## Setup and Deployment

1. Install dependencies:
   ```
   npm install
   ```

2. Build the project:
   ```
   npm run build
   ```

3. Deploy the stack:
   ```
   npm run cdk deploy
   ```

## Seeding Data

To seed the database with itinerary and places data from the CSV file:

1. Make sure the CSV file is available at the project root or in the backend directory
2. Run the seed script:
   ```
   npm run seed
   ```

The script will:
- Parse the CSV file with itinerary data
- Seed the itinerary table with all entries
- Extract places from the itinerary data (attractions, restaurants, accommodations)
- Seed the places table with the extracted places

## API Endpoints

- `GET /itinerary` - Get all itinerary items
- `GET /itinerary/{date}` - Get itinerary for a specific date
- `PUT /itinerary/{date}` - Update itinerary for a specific date
- `GET /places` - Get all places
- `GET /places/{city}` - Get places for a specific city
- `POST /places` - Create a new place
- `GET /notes` - Get all notes
- `POST /notes` - Create a new note
