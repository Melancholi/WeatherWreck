import * as fs from 'fs';
import csv from 'csv-parser';

const trimmedAccidentsPath = './server/db/initialDB/Trimmed_Accidents.csv';
const trimmedWeatherPath = './server/db/initialDB/Trimmed_Weather.csv';

const matchingAccidentsJsonPath = './server/db/finalDB/Matching_Accidents.json';
const matchingAccidentsCsvPath = './server/db/finalDB/Matching_Accidents_CSV.csv';

const matchingWeathersJsonPath = './server/db/finalDB/Matching_Weathers.json';
const matchingWeathersCsvPath = './server/db/finalDB/Matching_Weathers_CSV.csv';

// Helper function to check if an event already exists in the JSON file
function eventExistsInJson(filePath, id) {
  if (!fs.existsSync(filePath)) return false;
  try {
    const existingData = JSON.parse(fs.readFileSync(filePath));
    return existingData.some(event => event.ID === id || event.EventId === id);
  } catch (error) {
    console.error(`Error parsing JSON from ${filePath}:`, error);
    return false; // or handle it as needed
  }
}


// Write matching accidents and weather data directly to CSV and JSON
async function matchAccidentsWithWeather(accidentFile, weatherFile) {
  const weatherData = [];
  
  // Read and store weather data in memory
  await new Promise((resolve, reject) => {
    fs.createReadStream(weatherFile)
      .pipe(csv())
      .on('data', (weather) => {
        weatherData.push(weather);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // Create JSON files if they don't already exist
  if (!fs.existsSync(matchingAccidentsJsonPath)) {
    fs.writeFileSync(matchingAccidentsJsonPath, '[\n'); // Start JSON array
  }
  if (!fs.existsSync(matchingWeathersJsonPath)) {
    fs.writeFileSync(matchingWeathersJsonPath, '[\n'); // Start JSON array
  }

  // Setting up streams for CSV Output
  // flags: 'a' used so that new data is added instead of overiding
  // learned about flags from here -> https://nodejs.org/api/fs.html#file-system-flags
  const accidentCsvStream = fs.createWriteStream(matchingAccidentsCsvPath, { flags: 'a' });
  const weatherCsvStream = fs.createWriteStream(matchingWeathersCsvPath, { flags: 'a' });

  // Write headers if the files are empty
  if (!fs.existsSync(matchingAccidentsCsvPath) || fs.readFileSync(matchingAccidentsCsvPath, 'utf-8').trim() === '') {
    accidentCsvStream.write('ID,State,City,Severity,Start_Time,End_Time,Start_Lat,Start_Lng,Description,Street,End_lat,End_Lng,Distance(mi),Temperature(F)\n');
  }
  if (!fs.existsSync(matchingWeathersCsvPath) || fs.readFileSync(matchingWeathersCsvPath, 'utf-8').trim() === '') {
    weatherCsvStream.write('EventId,State,City,StartTime(UTC),EndTime(UTC),Severity,Type,LocationLat,LocationLng,Precipitation(in)\n');
  }

  // Process accidents and match with weather data
  await new Promise((resolve, reject) => {
    fs.createReadStream(accidentFile)
      .pipe(csv())
      .on('data', (accident) => {
        weatherData.forEach((weather) => {
          if (
            accident.State === weather.State &&
            accident.City === weather.City &&
            accident.Start_Lat === weather.LocationLat &&
            accident.Start_Lng === weather.LocationLng &&
            accident.Start_Time === weather['StartTime(UTC)']
          ) {
            // Check if this match has already been recorded in the JSON files
            if (!eventExistsInJson(matchingAccidentsJsonPath, accident.ID)) {
              // Write matched accident to JSON
              fs.appendFileSync(matchingAccidentsJsonPath, JSON.stringify(accident) + ',\n');
              // Write matched accident to CSV
              const accidentRow = Object.values(accident).join(',') + '\n';
              accidentCsvStream.write(accidentRow);
              console.log('Matching accident data saved.');
            }
            
            if (!eventExistsInJson(matchingWeathersJsonPath, weather.EventId)) {
              // Write matched weather event to JSON
              fs.appendFileSync(matchingWeathersJsonPath, JSON.stringify(weather) + ',\n');
              // Write matched weather event to CSV
              const weatherRow = Object.values(weather).join(',') + '\n';
              weatherCsvStream.write(weatherRow);
              console.log('Matching weather data saved.');
            }
          }
        });
      })
      .on('end', () => {
        fixJsonFile(matchingAccidentsJsonPath);
        fixJsonFile(matchingWeathersJsonPath);
        accidentCsvStream.end();
        weatherCsvStream.end();
        console.log('Matching accidents and weather data saved.');
        resolve();
      })
      .on('error', reject);
  });
}

// Function to fix the JSON file format
function fixJsonFile(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    if (content.endsWith(',\n')) {
      // Remove the last comma and newline
      fs.writeFileSync(filePath, content.slice(0, -2) + '\n]', 'utf-8');
    } else {
      // Close the JSON array properly
      fs.appendFileSync(filePath, '\n]', 'utf-8');
    }
  }
}

// Execute the steps
async function processCSVFiles() {
  try {
    // Perform the comparison and match relevant data
    await matchAccidentsWithWeather(trimmedAccidentsPath, trimmedWeatherPath);
	
  } catch (error) {
    console.error('Error processing CSV files:', error);
  }
}

processCSVFiles();