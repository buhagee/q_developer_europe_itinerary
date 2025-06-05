const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

// Get table name from environment variables or use default
const PLACES_TABLE = 'EuropeItineraryAppStack-PlacesTableE8547A05-4TIXVMCZUHIH';

// Read the CSV file from the user's home directory
const csvFilePath = '/home/buhagiar/europe_itinerary.csv';

// Parse the CSV data to extract locations
const parseItineraryForLocations = (csvData) => {
  const lines = csvData.trim().split('\n');
  const locations = new Set();
  
  lines.forEach(line => {
    const [_, location] = line.split('\t');
    if (location && location.trim()) {
      locations.add(location.trim());
    }
  });
  
  return Array.from(locations);
};

// Generate places data based on locations
const generatePlacesData = (locations) => {
  const places = [];
  
  // Define place types
  const placeTypes = ['ATTRACTION', 'RESTAURANT', 'ACCOMMODATION'];
  
  // For each location, create multiple places
  locations.forEach(location => {
    // Create attractions
    const attractionCount = Math.floor(Math.random() * 3) + 3; // 3-5 attractions per location
    for (let i = 0; i < attractionCount; i++) {
      places.push(generatePlace(location, 'ATTRACTION'));
    }
    
    // Create restaurants
    const restaurantCount = Math.floor(Math.random() * 3) + 2; // 2-4 restaurants per location
    for (let i = 0; i < restaurantCount; i++) {
      places.push(generatePlace(location, 'RESTAURANT'));
    }
    
    // Create accommodations
    const accommodationCount = Math.floor(Math.random() * 2) + 1; // 1-2 accommodations per location
    for (let i = 0; i < accommodationCount; i++) {
      places.push(generatePlace(location, 'ACCOMMODATION'));
    }
  });
  
  return places;
};

// Generate a single place
const generatePlace = (city, type) => {
  const attractions = {
    'Malta': ['St. Johns Co-Cathedral', 'Upper Barrakka Gardens', 'Mdina Old City', 'Blue Grotto', 'Hagar Qim Temples'],
    'London': ['Tower of London', 'British Museum', 'Buckingham Palace', 'London Eye', 'Westminster Abbey', 'St. Paul\'s Cathedral'],
    'Paris': ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Arc de Triomphe', 'Sacré-Cœur Basilica'],
    'Berlin': ['Brandenburg Gate', 'Reichstag Building', 'Berlin Wall Memorial', 'Museum Island', 'Checkpoint Charlie'],
    'Prague': ['Prague Castle', 'Charles Bridge', 'Old Town Square', 'Astronomical Clock', 'St. Vitus Cathedral'],
    'Rome': ['Colosseum', 'Vatican Museums', 'Trevi Fountain', 'Pantheon', 'Roman Forum'],
    'Venice': ['St. Mark\'s Square', 'Doge\'s Palace', 'Grand Canal', 'Rialto Bridge', 'Murano Island'],
    'Istanbul': ['Hagia Sophia', 'Blue Mosque', 'Topkapi Palace', 'Grand Bazaar', 'Bosphorus Strait'],
    'Cappadocia': ['Göreme Open-Air Museum', 'Hot Air Balloon Ride', 'Uçhisar Castle', 'Pasabag Valley', 'Derinkuyu Underground City'],
  };
  
  const restaurants = {
    'Malta': ['Ta\' Kris', 'Rubino', 'Noni', 'Guze Bistro', 'Rampila'],
    'London': ['The Ivy', 'Dishoom', 'Gordon Ramsay Restaurant', 'Sketch', 'Duck & Waffle'],
    'Paris': ['Le Jules Verne', 'Carette', 'L\'Ambroisie', 'Le Cinq', 'Septime'],
    'Berlin': ['Nobelhart & Schmutzig', 'Facil', 'Restaurant Tim Raue', 'Lorenz Adlon Esszimmer', 'Crossaint Couture'],
    'Prague': ['Field', 'La Degustation Bohême Bourgeoise', 'Eska', 'Café Savoy', 'Lokál Dlouhááá'],
    'Rome': ['La Pergola', 'Roscioli', 'Armando al Pantheon', 'Pierluigi', 'Aroma Restaurant'],
    'Venice': ['Osteria alle Testiere', 'Antiche Carampane', 'Quadri', 'Il Ridotto', 'Alle Corone'],
    'Istanbul': ['Mikla', 'Çiya Sofrası', 'Neolokal', 'Karaköy Lokantası', 'Seven Hills Restaurant'],
    'Cappadocia': ['Seki Restaurant', 'Seten Restaurant', 'Dibek Restaurant', 'Lil\'a Restaurant', 'Old Greek House'],
  };
  
  const accommodations = {
    'Malta': ['The Phoenicia Malta', 'Hilton Malta', 'InterContinental Malta', 'AX The Palace', 'Hotel Juliani'],
    'London': ['The Savoy', 'The Ritz London', 'Claridge\'s', 'The Dorchester', 'Shangri-La The Shard'],
    'Paris': ['The Ritz Paris', 'Four Seasons Hotel George V', 'Le Bristol Paris', 'Hôtel Plaza Athénée', 'Le Meurice'],
    'Berlin': ['Hotel Adlon Kempinski', 'The Circus Hostel', 'Hotel de Rome', 'Soho House Berlin', 'Das Stue'],
    'Prague': ['Four Seasons Hotel Prague', 'Augustine, a Luxury Collection Hotel', 'Mandarin Oriental, Prague', 'The Grand Mark Prague', 'Prague Dream Hostel'],
    'Rome': ['Hotel Hassler', 'Hotel de Russie', 'The St. Regis Rome', 'Hotel Eden', 'The Beehive'],
    'Venice': ['The Gritti Palace', 'Hotel Danieli', 'Belmond Hotel Cipriani', 'Aman Venice', 'Ca\' Sagredo Hotel'],
    'Istanbul': ['Four Seasons Hotel Istanbul at Sultanahmet', 'Çırağan Palace Kempinski', 'Pera Palace Hotel', 'Raffles Istanbul', 'Soho House Istanbul'],
    'Cappadocia': ['Museum Hotel', 'Argos in Cappadocia', 'Kayakapi Premium Caves', 'Sultan Cave Suites', 'Kale Konak Cave Hotel'],
  };
  
  let name, description, address, openingHours, website;
  
  if (type === 'ATTRACTION') {
    const cityAttractions = attractions[city] || [`${city} Historical Site`, `${city} Museum`, `${city} Park`, `${city} Monument`, `${city} Cathedral`];
    name = cityAttractions[Math.floor(Math.random() * cityAttractions.length)];
    description = `Popular tourist attraction in ${city}. A must-visit destination for travelers.`;
    address = `${Math.floor(Math.random() * 100) + 1} Main Street, ${city}`;
    openingHours = '9:00 AM - 5:00 PM';
    website = `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  } else if (type === 'RESTAURANT') {
    const cityRestaurants = restaurants[city] || [`${city} Bistro`, `${city} Café`, `${city} Restaurant`, `${city} Eatery`, `${city} Dining`];
    name = cityRestaurants[Math.floor(Math.random() * cityRestaurants.length)];
    description = `Delicious local cuisine in ${city}. Great atmosphere and service.`;
    address = `${Math.floor(Math.random() * 100) + 1} Food Street, ${city}`;
    openingHours = '11:00 AM - 10:00 PM';
    website = `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  } else if (type === 'ACCOMMODATION') {
    const cityAccommodations = accommodations[city] || [`${city} Hotel`, `${city} Hostel`, `${city} Apartments`, `${city} Suites`, `${city} Inn`];
    name = cityAccommodations[Math.floor(Math.random() * cityAccommodations.length)];
    description = `Comfortable accommodation in ${city}. Great location and amenities.`;
    address = `${Math.floor(Math.random() * 100) + 1} Stay Street, ${city}`;
    openingHours = 'Check-in: 2:00 PM, Check-out: 11:00 AM';
    website = `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  }
  
  return {
    id: uuidv4(),
    name,
    city,
    type,
    description,
    address,
    openingHours,
    website,
    imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(city)},${encodeURIComponent(type.toLowerCase())}`,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Random rating between 3.5 and 5.0
    createdAt: new Date().toISOString()
  };
};

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('Starting places database seeding...');
    
    // Read the CSV file
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    
    // Parse the CSV data to extract locations
    const locations = parseItineraryForLocations(csvData);
    console.log(`Found ${locations.length} unique locations`);
    
    // Generate places data
    const places = generatePlacesData(locations);
    console.log(`Generated ${places.length} places`);
    
    // Check if there are existing places
    const scanParams = {
      TableName: PLACES_TABLE,
    };
    
    const { Items } = await dynamoDb.send(new ScanCommand(scanParams));
    
    if (Items && Items.length > 0) {
      console.log(`Found ${Items.length} existing places. Skipping seeding.`);
      return;
    }
    
    // Seed places data
    console.log(`Seeding ${places.length} places...`);
    
    for (const place of places) {
      await dynamoDb.send(new PutCommand({
        TableName: PLACES_TABLE,
        Item: place
      }));
    }
    
    console.log('Places database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding places database:', error);
  }
};

// Run the seeding function
seedDatabase();
