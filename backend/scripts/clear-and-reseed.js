const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

// Table names from the AWS environment
const ITINERARY_TABLE = 'EuropeItineraryAppStack-ItineraryTable5E30CEE2-1CJXG0IYPE95E';
const PLACES_TABLE = 'EuropeItineraryAppStack-PlacesTableE8547A05-4TIXVMCZUHIH';
const NOTES_TABLE = 'EuropeItineraryAppStack-NotesTableD0D0D2F1-1MDW48S86WR0';

// Read the CSV file from the user's home directory
const csvFilePath = '/home/buhagiar/europe_itinerary.csv';

// Parse the CSV data
const parseItinerary = (csvData) => {
  const lines = csvData.trim().split('\n');
  return lines.map(line => {
    const [date, location, food, activities, accommodation, travel] = line.split('\t');
    return {
      date: formatDate(date),
      location,
      food: food || undefined,
      activities: activities || undefined,
      accommodation: accommodation || undefined,
      travel: travel || undefined
    };
  });
};

// Format date from DD/MM/YY to DD/MM/YY
const formatDate = (dateStr) => {
  return dateStr;
};

// Clear all items from a table
const clearTable = async (tableName) => {
  console.log(`Clearing table: ${tableName}`);
  
  try {
    // Scan to get all items
    const scanResult = await dynamoDb.send(new ScanCommand({
      TableName: tableName
    }));
    
    const items = scanResult.Items || [];
    console.log(`Found ${items.length} items to delete`);
    
    // Delete each item
    for (const item of items) {
      let key;
      
      if (tableName === ITINERARY_TABLE) {
        key = { date: item.date };
      } else {
        key = { id: item.id };
      }
      
      await dynamoDb.send(new DeleteCommand({
        TableName: tableName,
        Key: key
      }));
    }
    
    console.log(`Successfully cleared table: ${tableName}`);
  } catch (error) {
    console.error(`Error clearing table ${tableName}:`, error);
    throw error;
  }
};

// Generate places data based on the itinerary
const generatePlacesData = (itinerary) => {
  const places = [];
  const cities = [...new Set(itinerary.map(item => item.location))];
  
  // For each city, create some attractions
  cities.forEach(city => {
    // Add attractions based on activities mentioned in the itinerary
    const cityItineraryItems = itinerary.filter(item => item.location === city);
    
    cityItineraryItems.forEach(item => {
      if (item.activities) {
        const activities = item.activities.split(',');
        
        activities.forEach(activity => {
          const activityName = activity.trim();
          if (activityName && activityName.length > 3) {
            places.push({
              id: uuidv4(),
              name: activityName,
              city: city,
              type: 'ATTRACTION',
              description: `Popular attraction in ${city}`,
              imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(city)},attraction`,
              rating: (Math.random() * 1.5 + 3.5).toFixed(1) // Random rating between 3.5 and 5.0
            });
          }
        });
      }
      
      // Add restaurants
      if (item.food && item.food.length > 3) {
        places.push({
          id: uuidv4(),
          name: item.food.trim(),
          city: city,
          type: 'RESTAURANT',
          description: `Restaurant in ${city}`,
          imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(city)},restaurant`,
          rating: (Math.random() * 1.5 + 3.5).toFixed(1)
        });
      }
      
      // Add accommodations
      if (item.accommodation && item.accommodation.length > 3) {
        places.push({
          id: uuidv4(),
          name: item.accommodation.trim(),
          city: city,
          type: 'ACCOMMODATION',
          description: `Accommodation in ${city}`,
          imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(city)},hotel`,
          rating: (Math.random() * 1.5 + 3.5).toFixed(1)
        });
      }
    });
  });
  
  // Remove duplicates based on name and city
  const uniquePlaces = [];
  const seen = new Set();
  
  places.forEach(place => {
    const key = `${place.name}-${place.city}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniquePlaces.push(place);
    }
  });
  
  return uniquePlaces;
};

// Generate travel tips and notes
const generateNotes = (itinerary) => {
  const notes = [];
  
  // General travel tips
  notes.push({
    id: uuidv4(),
    date: itinerary[0].date, // First day
    content: 'Remember to exchange currency at the airport or use ATMs for better rates',
    createdAt: new Date().toISOString()
  });
  
  notes.push({
    id: uuidv4(),
    date: itinerary[0].date,
    content: 'Pack universal adapter for European outlets',
    createdAt: new Date().toISOString()
  });
  
  // City-specific notes
  const cityNotes = {
    'Malta': [
      'Bring sunscreen and a hat - Malta gets very hot in summer',
      'Public buses are the main form of transportation around the island'
    ],
    'London': [
      'Get an Oyster card for public transportation',
      'Many museums in London are free to enter'
    ],
    'Paris': [
      'Metro is the best way to get around Paris',
      'Many attractions offer discounts with the Paris Museum Pass'
    ],
    'Berlin': [
      'Berlin Welcome Card provides unlimited public transport and discounts',
      'Most shops are closed on Sundays'
    ],
    'Rome': [
      'Carry a water bottle - you can refill at public fountains',
      'Book Vatican and Colosseum tickets in advance to avoid lines'
    ],
    'Istanbul': [
      'Istanbul Museum Pass is worth it if visiting multiple sites',
      'Bargaining is expected in the Grand Bazaar'
    ],
    'Cappadocia': [
      'Book hot air balloon rides well in advance',
      'Comfortable walking shoes are essential for exploring the valleys'
    ]
  };
  
  // Add city-specific notes
  itinerary.forEach(item => {
    if (cityNotes[item.location]) {
      cityNotes[item.location].forEach(note => {
        notes.push({
          id: uuidv4(),
          date: item.date,
          content: note,
          createdAt: new Date().toISOString()
        });
      });
      
      // Remove the city from the object to avoid duplicates
      delete cityNotes[item.location];
    }
    
    // Add notes about specific activities
    if (item.activities && item.activities.includes('book closer')) {
      notes.push({
        id: uuidv4(),
        date: item.date,
        content: `Remember to book tickets for activities on ${item.date}`,
        createdAt: new Date().toISOString()
      });
    }
  });
  
  return notes;
};

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('Starting database clearing and reseeding...');
    
    // Clear all tables
    await clearTable(ITINERARY_TABLE);
    await clearTable(PLACES_TABLE);
    await clearTable(NOTES_TABLE);
    
    // Read and parse the CSV file
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const itinerary = parseItinerary(csvData);
    
    console.log(`Seeding ${itinerary.length} itinerary items...`);
    
    // Seed itinerary data
    for (const item of itinerary) {
      await dynamoDb.send(new PutCommand({
        TableName: ITINERARY_TABLE,
        Item: item
      }));
    }
    
    // Generate and seed places data
    const places = generatePlacesData(itinerary);
    console.log(`Seeding ${places.length} places...`);
    
    for (const place of places) {
      await dynamoDb.send(new PutCommand({
        TableName: PLACES_TABLE,
        Item: place
      }));
    }
    
    // Generate and seed notes data
    const notes = generateNotes(itinerary);
    console.log(`Seeding ${notes.length} notes...`);
    
    for (const note of notes) {
      await dynamoDb.send(new PutCommand({
        TableName: NOTES_TABLE,
        Item: note
      }));
    }
    
    console.log('Database clearing and reseeding completed successfully!');
  } catch (error) {
    console.error('Error during database clearing and reseeding:', error);
  }
};

// Run the seeding function
seedDatabase();
