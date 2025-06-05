import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

// Table names - these will be updated with actual table names from the stack
const ITINERARY_TABLE = process.env.ITINERARY_TABLE || 'EuropeItineraryAppStack-ItineraryTable5E30CEE2-Z1YTETQ2ZU7D';
const PLACES_TABLE = process.env.PLACES_TABLE || 'EuropeItineraryAppStack-PlacesTableE8547A05-YP88BRYK7OL';

// Function to seed itinerary data
async function seedItineraryData(csvFilePath: string) {
  const results: any[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser({
        separator: '\t', // Tab-separated values
        headers: ['date', 'location', 'food', 'activities', 'accommodation', 'travel'],
        skipLines: 0
      }))
      .on('data', (data: any) => results.push(data))
      .on('end', async () => {
        console.log(`Parsed ${results.length} itinerary items from CSV`);
        
        try {
          for (const item of results) {
            // Format the date to DD/MM/YY
            const dateParts = item.date.split('/');
            if (dateParts.length !== 3) {
              // Try to parse date in format DD/MM/YY
              const parts = item.date.split('/');
              if (parts.length === 3) {
                item.date = `${parts[0]}/${parts[1]}/${parts[2]}`;
              } else {
                // Try to parse date in format DD/MM/YYYY
                const parts = item.date.split('/');
                if (parts.length === 3 && parts[2].length === 4) {
                  item.date = `${parts[0]}/${parts[1]}/${parts[2].substring(2)}`;
                } else {
                  // Try to parse date in format DD-MM-YY
                  const parts = item.date.split('-');
                  if (parts.length === 3) {
                    item.date = `${parts[0]}/${parts[1]}/${parts[2]}`;
                  } else {
                    // Try to parse date in format YYYY-MM-DD
                    const parts = item.date.split('-');
                    if (parts.length === 3 && parts[0].length === 4) {
                      const year = parts[0].substring(2);
                      const month = parts[1];
                      const day = parts[2];
                      item.date = `${day}/${month}/${year}`;
                    }
                  }
                }
              }
            }

            // Clean up empty fields
            Object.keys(item).forEach(key => {
              if (item[key] === '') {
                item[key] = undefined;
              }
            });

            const params = {
              TableName: ITINERARY_TABLE,
              Item: item
            };

            await dynamoDb.send(new PutCommand(params));
            console.log(`Added itinerary item for date: ${item.date}`);
          }
          
          resolve(results.length);
        } catch (error) {
          console.error('Error seeding itinerary data:', error);
          reject(error);
        }
      })
      .on('error', (error: Error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

// Function to extract places from itinerary data and seed places table
async function seedPlacesData(csvFilePath: string) {
  const results: any[] = [];
  const places: any[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser({
        separator: '\t', // Tab-separated values
        headers: ['date', 'location', 'food', 'activities', 'accommodation', 'travel'],
        skipLines: 0
      }))
      .on('data', (data: any) => results.push(data))
      .on('end', async () => {
        try {
          // Extract places from activities, food, and accommodation
          for (const item of results) {
            const location = item.location;
            
            // Add food places
            if (item.food && item.food.trim() !== '') {
              const foodPlaces = item.food.split(',').map((place: string) => place.trim());
              for (const foodPlace of foodPlaces) {
                if (foodPlace && !places.some(p => p.name === foodPlace && p.city === location)) {
                  places.push({
                    id: uuidv4(),
                    name: foodPlace,
                    city: location,
                    type: 'RESTAURANT',
                    description: `Restaurant in ${location}`,
                    createdAt: new Date().toISOString()
                  });
                }
              }
            }
            
            // Add attractions from activities
            if (item.activities && item.activities.trim() !== '') {
              const attractions = item.activities.split(',').map((place: string) => place.trim());
              for (const attraction of attractions) {
                if (attraction && !places.some(p => p.name === attraction && p.city === location)) {
                  places.push({
                    id: uuidv4(),
                    name: attraction,
                    city: location,
                    type: 'ATTRACTION',
                    description: `Attraction in ${location}`,
                    createdAt: new Date().toISOString()
                  });
                }
              }
            }
            
            // Add accommodation
            if (item.accommodation && item.accommodation.trim() !== '') {
              if (!places.some(p => p.name === item.accommodation && p.city === location)) {
                places.push({
                  id: uuidv4(),
                  name: item.accommodation,
                  city: location,
                  type: 'ACCOMMODATION',
                  description: `Accommodation in ${location}`,
                  createdAt: new Date().toISOString()
                });
              }
            }
          }
          
          console.log(`Extracted ${places.length} places from itinerary data`);
          
          // Save places to DynamoDB
          for (const place of places) {
            const params = {
              TableName: PLACES_TABLE,
              Item: place
            };

            await dynamoDb.send(new PutCommand(params));
            console.log(`Added place: ${place.name} in ${place.city}`);
          }
          
          resolve(places.length);
        } catch (error) {
          console.error('Error seeding places data:', error);
          reject(error);
        }
      })
      .on('error', (error: Error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

// Main function to run the seeding process
async function main() {
  try {
    // Try multiple possible locations for the CSV file
    const possiblePaths = [
      path.resolve(__dirname, '../../../../europe_itinerary.csv'),
      path.resolve(__dirname, '../../../..', 'europe_itinerary.csv'),
      path.resolve(__dirname, '../europe_itinerary.csv'),
      path.resolve(__dirname, '../../europe_itinerary.csv')
    ];
    
    let csvFilePath = '';
    for (const testPath of possiblePaths) {
      console.log('Checking path:', testPath);
      if (fs.existsSync(testPath)) {
        csvFilePath = testPath;
        console.log('Found CSV file at:', csvFilePath);
        break;
      }
    }
    
    if (!csvFilePath) {
      console.error('Could not find CSV file in any of the expected locations');
      return;
    }
    
    console.log('Starting to seed itinerary data...');
    const itineraryCount = await seedItineraryData(csvFilePath);
    console.log(`Successfully seeded ${itineraryCount} itinerary items`);
    
    console.log('Starting to seed places data...');
    const placesCount = await seedPlacesData(csvFilePath);
    console.log(`Successfully seeded ${placesCount} places`);
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error in seeding process:', error);
    process.exit(1);
  }
}

// Run the main function
main();
