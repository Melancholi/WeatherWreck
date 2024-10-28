import * as fs from 'fs';
import * as fsp from 'fs/promises';
import csv from 'csv-parser';
import parse from 'csv-parser';

// The paths for the input files
const trimmedAccidentsPath = './db/initialDB/Trimmed_Accidents.csv';
const trimmedWeatherPath = './db/initialDB/Trimmed_Weather.csv';

// The paths for the files that will contain the accident and the weather events that match
const matchingAccidentsCsvPath = './db/initialDB/result/Matching_Accidents_CSV.csv';
const matchingWeathersCsvPath = './db/initialDB/result/Matching_Weathers_CSV.csv';

/**
 * This function is used to read the record from a specific file
 * 
 * @param {string} csvFile - The path to the weather CSV file 
 * @returns {Promise} - A promise that resolves to an array of data objects
 * 
 * @author Maara Vanessa Purici
 */
export async function readCsvData(csvFile) {
  const data = [];
  // To do this, I used the examples from here 
  // https://www.scaler.com/topics/read-csv-javascript/
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFile).
      pipe(parse({
        delimiter: ",",
        columns: true,
        ltrim: true,
      })).
      on('data', (row) => {
        data.push(row);
      }).
      on('error', reject).
      on('end', resolve);
  });
  return data;
}

/**
 * Helper function that is used to check if an event already exists in 
 * a CSV file based on a specific id
 * 
 * @param {string} filePath - The path of the CSV file to check 
 * @param {string} id - The id of the event to search for 
 * @returns {boolean} - Returns true if the event id is found, 
 * otherwise false
 * 
 * @author Maara Vanessa Purici
 */
export async function eventExists(filePath, id) {
  const data = await readCsvData(filePath);
  let found = false;
  data.forEach((event) => {
    if (event.ID === id || event.EventId === id) {
      // Exits early if a match is found
      found = true;
    }
  });
  return found;
}

/**
 * This function is used to write to the matched accidents CSV file
 *  
 * @param {string} accidentCsv - Path to the matching accidents CSV file.
 * @param {Object} accident - The accident to add to the CSV file.
 * 
 * @author Maara Vanessa Purici
 */
export function writeToAccidentsCsv(accidentCsv, accident) {
  // To do this, I used an example form here
  // https://heynode.com/blog/2020-02/reading-and-writing-csv-files-nodejs/
  const csvData = extractAsCsvForAccidents(accident);
  fs.writeFile(accidentCsv, csvData+'\n', err => {
    if (err) {
      console.log('Error writing to csv file', err);
    } else {
      console.log(`saved as ${accidentCsv}`);
    }
  });
}

/**
 * Helper function to extract accident data as a CSV string 
 *  
 * @param {Object} accident - The accident data.
 * @returns {string} - The CSV string for accident data.
 * 
 * @author Maara Vanessa Purici
 */
function extractAsCsvForAccidents(accident) {
  // To do this, I used an example form here
  // https://heynode.com/blog/2020-02/reading-and-writing-csv-files-nodejs/
  const rows = accident.map(acc =>
     `${acc.ID}, ${acc.State}, ${acc.City}, ${acc.Severity}, ${acc.Start_Time}, 
      ${acc.End_Time}, ${acc.Start_Lat}, ${acc.Start_Lng}, ${acc.Description},
      ${acc.Street}, ${acc.End_lat}, ${acc.End_Lng}, ${acc['Distance(mi)']},
      ${acc['Temperature(F)']}`
  );
  return rows.join("\n");
}

/**
 * Function used to add the header to the matching accident
 * events CSV file, if the file is empty
 *  
 * @returns {string} - The CSV string for accident data.
 * 
 * @author Maara Vanessa Purici
 */
export function writeToAccidentsCsvHeader(accidentCsv) {
  // To do this, I used an example form here
  // https://heynode.com/blog/2020-02/reading-and-writing-csv-files-nodejs/
  // Checking if file exists and is empty
  if (fs.existsSync(accidentCsv) && fs.statSync(accidentCsv).size > 0) {
    console.log(`Header already exists in ${accidentCsv}`);
    return;
  } else {
    fs.writeFile(accidentCsv, extractAsCsvForAccidentsHeader(), err => {
      if (err) {
        console.log('Error writing the header to the csv file', err);
      } else {
        console.log(`Header saved to ${accidentCsv}`);
      }
    });
  }
}


/**
 * Function used to extract the header for the 
 * accident data as a CSV string.
 * 
 * @returns {string} - The CSV header string for accident data.
 * 
 * @author Maara Vanessa Purici
 */
function extractAsCsvForAccidentsHeader() {
  // To do this, I used an example form here
  // https://heynode.com/blog/2020-02/reading-and-writing-csv-files-nodejs/
  const accidentColumns = [
    "ID, State, City, Severity, Start_Time, End_Time, Start_Lat, Start_Lng,",
    " Description, Street, End_lat, End_Lng, Distance(mi), Temperature(F)"
  ].join("");
  return accidentColumns + "\n";
}

/**
 * This function is used to write to the matched weather CSV file
 *  
 * @param {string} weatherCsv - Path to the matching weather CSV file.
 * @param {Object} weather - The weather to add to the CSV file.
 * 
 * @author Maara Vanessa Purici
 */
export function writeToWeatherCsv(weatherCsv, weather) {
  // To do this, I used an example form here
  // https://heynode.com/blog/2020-02/reading-and-writing-csv-files-nodejs/
  const csvData = extractAsCsvForWeather(weather);
  fs.writeFile(weatherCsv, csvData+'\n', err => {
    if (err) {
      console.log('Error writing to csv file', err);
    } else {
      console.log(`saved as ${weatherCsv}`);
    }
  });
}

/**
 * Helper function to extract weather data as a CSV string 
 *  
 * @param {Object} weather - The weather data.
 * @returns {string} - The CSV string for weather data.
 * 
 * @author Maara Vanessa Purici
 */
function extractAsCsvForWeather(weather) {
  // To do this, I used an example form here
  // https://heynode.com/blog/2020-02/reading-and-writing-csv-files-nodejs/
  const rows = weather.map(wea =>
     `${wea.EventId}, ${wea.State}, ${wea.City}, ${wea['StartTime(UTC)']},  
      ${wea['EndTime(UTC)']}, ${wea.Severity}, ${wea.Type},
      ${wea.LocationLat}, ${wea.LocationLng}, ${wea['Precipitation(in)']}`
  );
  return rows.join("\n");
}

/**
 * Function used to add the header to the matching weather
 * events CSV file, if the file is empty
 *  
 * @returns {string}- The header for the CSV file.
 * 
 * @author Maara Vanessa Purici
 */
export function writeToWeatherCsvHeader(weatherCsv) {
  // To do this, I used an example form here
  // https://heynode.com/blog/2020-02/reading-and-writing-csv-files-nodejs/
  // Checking if file exists and is empty
  if (fs.existsSync(weatherCsv) && fs.statSync(weatherCsv).size > 0) {
    console.log(`Header already exists in ${weatherCsv}`);
    return;
  } else {
    fs.writeFile(weatherCsv, extractAsCsvForWeatherHeader(), err => {
      if (err) {
        console.log('Error writing the header to the csv file', err);
      } else {
        console.log(`Header saved to ${weatherCsv}`);
      }
    });
}
}

/**
 * Function used to extract the header for the 
 * weather data as a CSV string.
 * 
 * @returns {string} - The CSV header string for weather data.
 * 
 * @author Maara Vanessa Purici
 */
function extractAsCsvForWeatherHeader() {
  // To do this, I used an example form here
  // https://heynode.com/blog/2020-02/reading-and-writing-csv-files-nodejs/
  
  const weatherColumns = [
    "EventId, State, City, StartTime(UTC), EndTime(UTC), Severity,", " Type, LocationLat, LocationLng, Precipitation(in)"
  ].join("");
  return weatherColumns + "\n";
}

/**
 * This function is used to check if the accdient and weather data match
 * based on State, City and Time
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
    accident.Start_Time === weather['StartTime(UTC)']
  ) {
    return true;
  }
  return false;
}

/**
 * This function is used to add the matching accident and weather data to 
 * the respective CSV files if they are not already recorded
 * 
 * @param {Object} accident - The accident data object
 * @param {Object} weather - The weather data object
 * @param accidentCsv - The file to write to the matching accident eventss
 * @param weatherCsv - The file to write to the matching weather events
 * 
 * @author Maara Vanessa Purici
 */
export function addMatchingData(accident, weather, accidentCsv, weatherCsv) {
  if (isDataMatching(accident, weather)){
    // Checking if this match has already been recorded in the CSV files
    if (!eventExists(accidentCsv, accident.ID)) {
      // Writing matched accident to CSV
      writeToAccidentsCsv(accidentCsv, accident);
      console.log('Matching accident data saved.');
    }
    
    if (!eventExists(weatherCsvStream, weather.EventId)) {
      // Writing matched weather event to CSV
      writeToWeatherCsv(weatherCsv, weather);
      console.log('Matching weather data saved.');
    }
  }
}

/**
 * Async function used to match accident event with weather events based on 
 * the State, City and Time 
 * The mathcing records is writen to the CSV files
 * 
 * @param {string} accidentFile - The path to the accidents CSV file to read from
 * @param {string} weatherFile - The path to the weather CSV file to read from
 * @param {string} matchedAccidentCsv - The file to write to the matching accident events
 * @param {string} matchedWeatherCsv - The file to write to the matching weather events
 * 
 * @author Maara Vanessa Purici
 */
export async function matchAccidentsWithWeather(accidentFile, weatherFile, matchedAccidentCsv, matchedWeatherCsv) {
  const weatherData = await readCsvData(weatherFile);
  const accidentData = await readCsvData(accidentFile)

  try{
    writeToAccidentsCsvHeader(matchedAccidentCsv);
    writeToWeatherCsvHeader(matchedWeatherCsv);
    accidentData.forEach((accident) => {
      weatherData.forEach((weather) => {
        addMatchingData(accident, weather, matchedAccidentCsv, matchedWeatherCsv);
      });
    });
  } catch (error) {
    console.error('Error while looking for matching events: ', error);
  }
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