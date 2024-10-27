import * as fs from 'fs';
import * as fsp from 'fs/promises';
import csv from 'csv-parser';

// The paths for the input files
const trimmedAccidentsPath = './db/initialDB/Trimmed_Accidents.csv';
const trimmedWeatherPath = './db/initialDB/Trimmed_Weather.csv';

// The paths for the files that will contain the accident and the weather events that match
const matchingAccidentsCsvPath = './db/initialDB/result/Matching_Accidents_CSV.csv';
const matchingWeathersCsvPath = './db/initialDB/result/Matching_Weathers_CSV.csv';

/**
 * Helper function that is used to check if an event already exists in 
 * a CSV file based on a specific id
 * 
 * @param {string} filePath - The path of the CSV file to check 
 * @param {string} id - The id of the evnt to search for 
 * @returns {boolean} - Returns true if the event id is found, 
 * otherwise false
 * 
 * @author Maara Vanessa Purici
 */
export async function eventExists(filePath, id) {
  let found = false;
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath).
      pipe(csv()).
      on('data', (event) => {
        if (event.ID === id || event.EventId === id) {
          // Exits early if a match is found
          found = true;
        }
      }).
      on('end', () => {
        resolve(found);
      }).
      on('error', () => {
        console.error(`Error parsing JSON from ${filePath}:`, error);
        reject(error);
      });
  });
}

/**
 * This function is used to read the weather events from the specified file
 * 
 * @param {string} weatherFile - The path to the weather CSV file 
 * @returns {Promise} - A promise that resolves to an array of weather data objects
 * 
 * @author Maara Vanessa Purici
 */
export async function readWeatherData(weatherFile) {
  const weatherData = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(weatherFile).
      pipe(csv()).
      on('data', (weather) => {
        weatherData.push(weather);
      }).
      on('end', resolve).
      on('error', reject);
  });
  return weatherData;
}

/**
 * This function is used to initialize the CSV streams and write headers 
 * if needed
 * 
 * @param {string} accidentCsv - Path to the accident CSV file.
 * @param {string} weatherCsv - Path to the weather CSV file.
 * @returns {Object} - An object containing the accident and weather CSV streams
 * 
 * @author Maara Vanessa Purici
 */
export function initializeCsvStreams(accidentCsv, weatherCsv) {
  // Setting up streams for CSV Output
  // flags: 'a' used so that new data is added instead of overiding
  // learned about flags from here -> https://nodejs.org/api/fs.html#file-system-flags
  const accidentCsvStream = fs.createWriteStream(accidentCsv, { flags: 'a' });
  const weatherCsvStream = fs.createWriteStream(weatherCsv, { flags: 'a' });

  // Writing headers if the files are empty
  if (
    !fs.existsSync(matchingAccidentsCsvPath) || 
    fs.readFile(matchingAccidentsCsvPath, 'utf-8').trim() === ''
  ) {
    accidentCsvStream.write(
      'ID,State,City,Severity,Start_Time,End_Time,Start_Lat,Start_Lng,' +
      'Description,Street,End_lat,End_Lng,Distance(mi),Temperature(F)\n'
    );
  }
  if (
    !fs.existsSync(matchingWeathersCsvPath) || 
    fs.readFile(matchingWeathersCsvPath, 'utf-8').trim() === ''
  ) {
    weatherCsvStream.write(
      'EventId,State,City,StartTime(UTC),EndTime(UTC),Severity,Type,' +
      'LocationLat,LocationLng,Precipitation(in)\n'
    );
  }

  return { accidentCsvStream, weatherCsvStream };
}

/**
 * This function is used to check if the accdient and weather data match
 * based on State, City, Location Latitude and Logitude and Time
 * 
 * @param {Object} accident - The accident data object 
 * @param {Object} weather - The weather data object 
 * @returns {boolean} - Returns true if the accident and weather data match
 * 
 * @author Maara Vanessa Purici
 */
export function isDataMatching(accident, weather) {
  if (
    accident.State === weather.State &&
    accident.City === weather.City &&
    accident.Start_Lat === weather.LocationLat &&
    accident.Start_Lng === weather.LocationLng &&
    accident.Start_Time === weather['StartTime(UTC)']
  ) {
    return true;
  }
  return false;
}

/**
 * This function is used to add the matching accident and weather data to 
 * the respective JSON and CSV files if they are not already recorded
 * 
 * @param {Object} accident - The accident data object
 * @param {Object} weather - The weather data object
 * @param accidentCsvStream - The writable stream for the accident CSV file
 * @param weatherCsvStream - The writable stream for the weather CSV file
 * 
 * @author Maara Vanessa Purici
 */
export function addMatchingData(accident, weather, accidentCsvStream, weatherCsvStream) {
  if (isDataMatching(accident, weather)){
    // Checking if this match has already been recorded in the CSV files
    if (!eventExists(accidentCsvStream, accident.ID)) {
      // Writing matched accident to CSV
      const accidentRow = Object.values(accident).join(',') + '\n';
      accidentCsvStream.write(accidentRow);
      console.log('Matching accident data saved.');
    }
    
    if (!eventExists(weatherCsvStream, weather.EventId)) {
      // Writing matched weather event to CSV
      const weatherRow = Object.values(weather).join(',') + '\n';
      weatherCsvStream.write(weatherRow);
      console.log('Matching weather data saved.');
    }
  }
}

/**
 * Async function used to match accident event with weather events based on 
 * the State, City, Location Latitude and Logitude and Time 
 * The mathcing records is writen to JSON and CSV files
 * 
 * @param {string} accidentFile - The path to the accidents CSV file 
 * @param {string} weatherFile - The path to the weather CSV file
 * 
 * @author Maara Vanessa Purici
 */
export async function matchAccidentsWithWeather(accidentFile, weatherFile, matchedAccidentCsv, matchedWeatherCsv) {
  const weatherData = await readWeatherData(weatherFile);

  const { accidentCsvStream, weatherCsvStream } = initializeCsvStreams(matchedAccidentCsv, matchedWeatherCsv);
  // Processing accidents and match with weather data
  await new Promise((resolve, reject) => {
    // Creating a readable stream that read data from the specified CSV file
    fs.createReadStream(accidentFile).
      pipe(csv()).
      on('data', (accident) => {
        // This code runs each time data is available to read
        weatherData.forEach((weather) => {
          addMatchingData(accident, weather, accidentCsvStream, weatherCsvStream);
        });
      }).
      on('end', () => {
        // This code runs when all the data has been read
        accidentCsvStream.end();
        weatherCsvStream.end();
        console.log('Matching accidents and weather data saved.');
        resolve();
      }).
      on('error', reject);
  });
}

/**
 * This function is used to execute the steps
 */
async function processCSVFiles() {
  try {
    // Perform the comparison and match relevant data
    await matchAccidentsWithWeather(
      trimmedAccidentsPath, 
      trimmedWeatherPath, 
      matchingAccidentsCsvPath, 
      matchingWeathersCsvPath
    );

  } catch (error) {
    console.error('Error processing CSV files:', error);
  }
}

// Starting the process
processCSVFiles();