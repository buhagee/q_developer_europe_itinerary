const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

// Get table names from environment variables or use defaults
const ITINERARY_TABLE = process.env.ITINERARY_TABLE || 'europe-itinerary-backend-dev-itinerary';
const PLACES_TABLE = process.env.PLACES_TABLE || 'europe-itinerary-backend-dev-places';
const NOTES_TABLE = process.env.NOTES_TABLE || 'europe-itinerary-backend-dev-notes';

// Parse CSV data from the itinerary
const itineraryData = `
18/06/25,Malta,,,Airbnb - Miami apartments Dragonara Rd, Paceville San Julian, STJ 3141,Flight A: Syd 9:10pm -> DXB 5:40AM + 1 day, Flight B: DXB 7:55am -> LCA 11am, Flight C: LCA 12:15pm -> MLA 2:00pm
19/06/25,Malta,,Valletta, St. Johns Co-Cathedral and Upper Barrakka Gardens, Mdina and three Cities,,
20/06/25,Malta,,Day trip Gozo / Comino 9am from 24 Triq San Geraldu, San Pawk il-Bahar,,
21/06/25,London,,,Airbnb - Cebbell Street, London, Greater London NW1 5AY,Flight: MLA 8:25am -> LGW 10:55am
22/06/25,London,,Buckingham Palace - Sunday Parade, London Eye, Big Ben, Westminister Abbey, Walk across Tower Bridge, Borough Market,,
23/06/25,London,,Tower of London (10:30-11 entry), British Museum, National Gallery, Trafalgar Square, Covent Garden & St. Paul's Cathedral,,
24/06/25,Paris,,,Airbnb - 191 Rue Saint-Honore Paris, Ile-de-France 75001,Train: London St Panras Intl 10:24am -> Paris Nord 1:58pm
25/06/25,Paris,Carette - opens 7:30am - can't book,Arc de Triomphe, Louvre Museum - 12pm, tuileries Garden towards Place de la Concorde, Climb Eiffel Tower- 22:30,,
26/06/25,Paris,,Montmartre, Sacre-Coeur Basilica, Place Du Tertre, Sainte-Chapelle, Latin Quarter, Luxembourg Gardens, Champs-Elysees,,
27/06/25,Defqon,,Defqon music festival,Glamping at defqon,Train A: Paris Nord 8:25 am -> Schipol Airport 11;33am, Train B: Schipol Airport -> Amsterdam Central, Bus 2pm -> Defqon
28/06/25,Defqon,,Defqon music festival,,
29/06/25,Defqon,,Defqon music festival,,
30/06/25,Berlin,,,The Circus Hostel,Bus: Defqon 9am -> Schipol Airport, Flight: AMS 12:25pm -> BER 1:45pm
01/07/25,Berlin,Crossaint Couture , Cinnamood - Oranienburger Str 8,Brandenburg Gate, Reichstag Building (3:30), Holocaust Memorial, topography of terror museum,,
02/07/25,Berlin,,Reichstag Building (9:00am), Reichstag Building (10:30am), East side gallery, museum island, spree river cruise, berliner Dom,,
03/07/25,Prague,,,Prague Dream Hostel,Train: Berlin Suedkreuz 11:23am -> Prague-Holesovice 3:13pm
04/07/25,Prague,,Old Town Square, astronomical Clock (buy ticket closer), old town hall, jewish quarter, old jewish cemetary and old synagogue, charles bridge and prague castle,,
05/07/25,Prague,,Prague Castle (buy ticket closer), st vitus cathedral and the golden lane, lesser town, including the lennon wall and church of st nicholas,,
06/07/25,Ravello,,,Airbnb - Via Casa Rossa, 12 Ravello, Campania 84010,Flight: PRG 6:00am -> FCO 7:55am. Car - pickup 8:30am from AVIS
07/07/25,Ravello,,Villa Rufolo, villa cimbrone, Vescovado Piazza,,
08/07/25,Ravello,,Duomo di Ravello, Ravello-Atrani-Amalfi path, shopping,,
09/07/25,Rome,Terrace Borromini,,The Beehive,Drop off Car 3:30pm AVIS Roma Termini
10/07/25,Rome,The Court Bar,Collosseum (book closer) roman Forum, palatine Hill, Pantheon, trevi fountain, piazza Navona,,
11/07/25,Rome,Aroma restaurant,Vatican Museums - 12:30pm and Sistine Chapel, St Peters Basilica and st peters Square,,
12/07/25,Venice,,,Airbnb -Calle Seconda del Cristo, 1800 Venezia, veneto 30121,Train: Roma Termini 9:35am -> Venezia S. Lucia 1:34pm
13/07/25,Venice,,St Marks Square, St Marks Basilica (book closer), doge's palace (book closer), the seat of venetian power, gondola ride on grand canal, Rialto Market, Accademia Galleries,,
14/07/25,Lake Como,,,Airbnb - Via Santuario, 1 Ossuccio, Lombardia 22010,Train A: Venezia S. Lucia 10:48am -> Milano Centrale 1:15pm, Train B: Milano Centrale (RE 25520 - No Ticket) 1:43pm -> Como S. Giovanni 2:22pm
15/07/25,Lake Como,,Villa del Balbianello 11:15am, lakefront stroll, boat trip,,
16/07/25,Interlakken,,,Airbnb - Schmockenstrasse 121 Beatenberg, BE, 3803,Train A: Como S.Giovanni 9:50am -> Zuerich Hb 12:27pm, Train B: Zuerich Hb 1:02pm -> Interlakken Ost 2:59pm
17/07/25,Interlakken,swiss fondue,Hoeweg, check out local markets and shops, boath trip on lake thun or lake brienz, Harder Kulm viewpoint,,
18/07/25,Interlakken,,Grindelwald (cable car up and adventure activites and views),,
19/07/25,Lyon,,,Airbnb - 25 Cours Suchet Lyon, Auvergne-Rhone-Alpes 69002,Train A: Interlakken Ost 8:29am -> Basel Sbb 10:34am, Train B: Basel Sbb (TER 96222 - No Ticket) 11:21 -> Mulhouse Ville 11:44, Train C: Mulhouse Ville 12:00pm -> Lyon Part Dieu 3:05pm
20/07/25,Lyon,,Parc de la Tete d'or (park with zoo and botanical garden), Musee des confluences (museum), Musée des Beaux-Arts, Les Halles Paul Bocuse Market, river cruise,,
21/07/25,Nice,,,Hotel Esprit D'azur,Train: Lyon Part Dieu 8:06 -> Nice Ville 1:02pm
22/07/25,Nice,,Monaco,,
23/07/25,Nice,,Old Town, Cours Saleya open air market, cathedrale sainte-reparate, port of Nice, Promenade des anglais, castle hill,,
24/07/25,Antwerp,,,Park Inn by Radisson,Flight: NCE 4:30pm -> BRU 6:15pm, Train: Brussels Aiport-Zaventem (EC 9263) 7:10pm -> Anvers-Central 7:42pm
25/07/25,Tomorrowland,,Tomorrowland festival,,
26/07/25,Tomorrowland,,Tomorrowland festival,,
27/07/25,Tomorrowland,,Tomorrowland festival,,
28/07/25,Istanbul,seven hills restaurant,,Airbnb - Sehsuvar Bey, Kadirga Hamam Sokak No:54 Fatih, Istanbul,Train: Anvers-Central (IC2608) 8:51am -> Brussels Airport-Zaventem 9:20am, light A: BRU 11:15am -> ATH 3:15pm, Flight B: ATH 6:30pm -> IST 8:00pm
29/07/25,Istanbul,San Sebastián cheesecake,Sultanahmet Square, hagia sophia, blue mosque, Topkapi Palace, Grand Bazaar, Bosphorus Cruise,,
30/07/25,Istanbul,galata tower,Basilica Cistern, Ancient roman Hoppodrome, Dolmabahce Palace, shopping at taksim square,,
31/07/25,Cappadocia,,,Airbnb - Ayvaz Efendi Sokak No:12 Goreme, Nevsehir 50180,Flight: IST 11:15am -> CAP 12:35pm
01/08/25,Cappadocia,,Hot air balloon, goreme open air museum, red valley, devrent valley, pasabag valley, Uchisar Castle,,
02/08/25,Cappadocia,,Kaymaklu underground city, Ihlara Valley, Pigeon Valley,,
03/08/25,Sydney,,,,"Flight A: CAP 1:20pm -> IST 2:55pm, Flight B: IST 7:25pm -> DXB 12:55am + 1 day, Flight C: DXB 2:15am -> SYD 10:05pm"
`;

// Parse the CSV data
const parseItinerary = (csvData) => {
  const lines = csvData.trim().split('\n');
  return lines.map(line => {
    const [date, location, food, activities, accommodation, travel] = line.split(',');
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

// Sample places data
const placesData = [
  {
    id: uuidv4(),
    name: 'St. Johns Co-Cathedral',
    city: 'Malta',
    type: 'ATTRACTION',
    description: 'Baroque cathedral with ornate interior and Caravaggio paintings',
    address: 'St John Street, Valletta, Malta',
    openingHours: '9:30 AM - 4:30 PM',
    website: 'https://www.stjohnscocathedral.com/',
    imageUrl: 'https://source.unsplash.com/800x600/?cathedral,malta',
    rating: 4.8
  },
  {
    id: uuidv4(),
    name: 'Upper Barrakka Gardens',
    city: 'Malta',
    type: 'ATTRACTION',
    description: 'Public garden with panoramic views of Grand Harbour',
    address: 'Valletta, Malta',
    openingHours: 'Open 24 hours',
    website: 'https://www.visitmalta.com/en/upper-barrakka-gardens',
    imageUrl: 'https://source.unsplash.com/800x600/?garden,malta',
    rating: 4.7
  },
  {
    id: uuidv4(),
    name: 'Buckingham Palace',
    city: 'London',
    type: 'ATTRACTION',
    description: 'Official residence of the British monarch',
    address: 'Westminster, London SW1A 1AA, UK',
    openingHours: 'Summer opening: 9:30 AM - 5:30 PM',
    website: 'https://www.rct.uk/visit/buckingham-palace',
    imageUrl: 'https://source.unsplash.com/800x600/?buckingham,palace',
    rating: 4.5
  },
  {
    id: uuidv4(),
    name: 'Tower of London',
    city: 'London',
    type: 'ATTRACTION',
    description: 'Historic castle and former prison on the north bank of the River Thames',
    address: 'London EC3N 4AB, UK',
    openingHours: '9:00 AM - 5:30 PM',
    website: 'https://www.hrp.org.uk/tower-of-london/',
    imageUrl: 'https://source.unsplash.com/800x600/?tower,london',
    rating: 4.6
  },
  {
    id: uuidv4(),
    name: 'Louvre Museum',
    city: 'Paris',
    type: 'ATTRACTION',
    description: 'World\'s largest art museum and historic monument',
    address: 'Rue de Rivoli, 75001 Paris, France',
    openingHours: '9:00 AM - 6:00 PM, Closed on Tuesdays',
    website: 'https://www.louvre.fr/en',
    imageUrl: 'https://source.unsplash.com/800x600/?louvre,paris',
    rating: 4.7
  },
  {
    id: uuidv4(),
    name: 'Eiffel Tower',
    city: 'Paris',
    type: 'ATTRACTION',
    description: 'Iconic wrought-iron lattice tower on the Champ de Mars',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    openingHours: '9:00 AM - 12:45 AM',
    website: 'https://www.toureiffel.paris/en',
    imageUrl: 'https://source.unsplash.com/800x600/?eiffel,tower',
    rating: 4.6
  },
  {
    id: uuidv4(),
    name: 'Carette',
    city: 'Paris',
    type: 'RESTAURANT',
    description: 'Classic Parisian café known for pastries and macarons',
    address: '4 Place du Trocadéro et du 11 Novembre, 75016 Paris, France',
    openingHours: '7:30 AM - 11:30 PM',
    website: 'https://www.carette-paris.fr/',
    imageUrl: 'https://source.unsplash.com/800x600/?cafe,paris',
    rating: 4.3
  },
  {
    id: uuidv4(),
    name: 'Brandenburg Gate',
    city: 'Berlin',
    type: 'ATTRACTION',
    description: '18th-century neoclassical monument and symbol of Berlin',
    address: 'Pariser Platz, 10117 Berlin, Germany',
    openingHours: 'Open 24 hours',
    website: 'https://www.visitberlin.de/en/brandenburg-gate',
    imageUrl: 'https://source.unsplash.com/800x600/?brandenburg,gate',
    rating: 4.7
  },
  {
    id: uuidv4(),
    name: 'The Circus Hostel',
    city: 'Berlin',
    type: 'ACCOMMODATION',
    description: 'Modern hostel with private rooms and dormitories',
    address: 'Weinbergsweg 1a, 10119 Berlin, Germany',
    website: 'https://www.circus-berlin.de/',
    imageUrl: 'https://source.unsplash.com/800x600/?hostel,berlin',
    rating: 4.4
  }
];

// Sample notes data
const notesData = [
  {
    id: uuidv4(),
    date: '18/06/25',
    content: 'Remember to exchange currency at the airport',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    date: '18/06/25',
    content: 'Pack adapter for European outlets',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    date: '21/06/25',
    content: 'Check if London Eye tickets need to be booked in advance',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    date: '25/06/25',
    content: 'Louvre Museum entry at 12pm - arrive 30 minutes early',
    createdAt: new Date().toISOString()
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Seed itinerary data
    const itinerary = parseItinerary(itineraryData);
    console.log(`Seeding ${itinerary.length} itinerary items...`);
    
    for (const item of itinerary) {
      await dynamoDb.send(new PutCommand({
        TableName: ITINERARY_TABLE,
        Item: item
      }));
    }
    
    // Seed places data
    console.log(`Seeding ${placesData.length} places...`);
    for (const place of placesData) {
      await dynamoDb.send(new PutCommand({
        TableName: PLACES_TABLE,
        Item: place
      }));
    }
    
    // Seed notes data
    console.log(`Seeding ${notesData.length} notes...`);
    for (const note of notesData) {
      await dynamoDb.send(new PutCommand({
        TableName: NOTES_TABLE,
        Item: note
      }));
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seeding function
seedDatabase();
