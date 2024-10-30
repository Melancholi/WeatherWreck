import * as fs from 'fs';
import csv from 'csv-parser';

const accidentsCsvPath = './server/db/initialDB/US_Accidents_March23.csv';
const trimmedAccidentsPath = './server/db/initialDB/Trimmed_Accidents.csv';

const weatherCsvPath = './server/db/initialDB/WeatherEvents_Jan2016-Dec2022.csv';
const trimmedWeatherPath = './server/db/initialDB/Trimmed_Weather.csv';

// learned how to read from csv file from the following links:
// https://www.npmjs.com/package/csv-parse
// https://www.npmjs.com/package/csv-parser
// https://nodejs.org/api/fs.html#file-system-flags

/**
 * Function used to trim the CSV file containing the accident events
 */
async function trimAccidentData(inputFile, outputFile) {
  const columnsToKeep = [
	  'ID',
    'State', 
    'City', 
    'Severity', 
    'Start_Time', 
    'End_Time', 
    'Start_Lat', 
    'Start_Lng', 
    'Description', 
    'Street', 
    'End_lat', 
    'End_Lng', 
    'Distance(mi)', 
    'Temperature(F)'
  ];
  
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputFile);
    writeStream.write(columnsToKeep.join(',') + '\n'); // Write headers

    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (accident) => {
        const startTime = new Date(accident['Start_Time']);
        const startYear = startTime.getFullYear();
        // Filter for year 2022
        if (startYear == 2022) {
          const trimmedRow = columnsToKeep.map((col) => accident[col] || '').join(',');
          writeStream.write(trimmedRow + '\n');
        }
      })
      .on('end', () => {
        writeStream.end();
        console.log(`Trimmed accident data saved to ${outputFile}`);
        resolve();
      })
      .on('error', (error) => reject(error));
  });
}

/**
 * Function used to trim the CSV file containing the weather events
 */
async function trimWeatherData(inputFile, outputFile) {
  const columnsToKeep = [
	  'EventId',
    'State', 
    'City', 
    'StartTime(UTC)', 
    'EndTime(UTC)', 
    'Severity', 
    'Type', 
    'LocationLat', 
    'LocationLng', 
    'Precipitation(in)'
  ];

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputFile);
    writeStream.write(columnsToKeep.join(',') + '\n'); // Write headers

    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (weather) => {
        const startTime = new Date(weather['StartTime(UTC)']);
        const startYear = startTime.getFullYear();
        // Filter for year 2022
        if (startYear == 2022) {
          const trimmedRow = columnsToKeep.map((col) => weather[col] || '').join(',');
          writeStream.write(trimmedRow + '\n');
        }
      })
      .on('end', () => {
        writeStream.end();
        console.log(`Trimmed weather data saved to ${outputFile}`);
        resolve();
      })
      .on('error', (error) => reject(error));
  });
}

// Execute the steps
async function trimCSVFiles() {
  try {
    // Trim both accidents and weather data
    await trimAccidentData(accidentsCsvPath, trimmedAccidentsPath);
    await trimWeatherData(weatherCsvPath, trimmedWeatherPath);
	
  } catch (error) {
    console.error('Error processing CSV files:', error);
  }
}

trimCSVFiles();