import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

// Function to parse the CSV file and convert it to the correct format
async function parseCSV(csvFilePath: string) {
  const results: any[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser({
        separator: '\t', // Tab-separated values
        headers: ['date', 'location', 'food', 'activities', 'accommodation', 'travel'],
        skipLines: 0
      }))
      .on('data', (data: any) => {
        // Format the date to DD/MM/YY if needed
        const dateParts = data.date.split('/');
        if (dateParts.length !== 3) {
          // Try to parse date in format DD/MM/YYYY
          const dateParts = data.date.split('/');
          if (dateParts.length === 3 && dateParts[2].length === 4) {
            data.date = `${dateParts[0]}/${dateParts[1]}/${dateParts[2].substring(2)}`;
          }
        }
        
        results.push(data);
      })
      .on('end', () => {
        console.log(`Parsed ${results.length} items from CSV`);
        console.log('Sample data:', results[0]);
        resolve(results);
      })
      .on('error', (error: Error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

// Main function
async function main() {
  try {
    const csvFilePath = path.resolve(__dirname, '../../../../europe_itinerary.csv');
    console.log('CSV file path:', csvFilePath);
    
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file does not exist at path: ${csvFilePath}`);
      return;
    }
    
    const data = await parseCSV(csvFilePath);
    console.log(`Successfully parsed ${(data as any[]).length} items`);
  } catch (error) {
    console.error('Error parsing CSV:', error);
  }
}

// Run the main function
main();
