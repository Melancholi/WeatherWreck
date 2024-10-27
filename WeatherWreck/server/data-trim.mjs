import * as fs from 'fs';
import csv from 'csv-parser';

// The path to the initial dataset for the accident events
// If you run this, it will give you an error since I am not commiting the initial dataset beacuse is very big
const accidentsCsvPath = './db/initialDB/US_Accidents_March23.csv';
// The path to the trimmed accident events dataset
const trimmedAccidentsPath = './db/initialDB/Trimmed_Accidents.csv';

// The path to the initial dataset for the weather events
// If you run this, it will give you an error since I am not commiting the initial dataset beacuse is very big
const weatherCsvPath = './db/initialDB/WeatherEvents_Jan2016-Dec2022.csv';
// The path to the trimmed weather events dataset
const trimmedWeatherPath = './db/initialDB/Trimmed_Weather.csv';

// Learned how to read from csv files from the following links:
// https://www.npmjs.com/package/csv-parse
// https://www.npmjs.com/package/csv-parser
// https://nodejs.org/api/fs.html#file-system-flags

/**
 * This function is used to trim the CSV file containing the accident events
 * to keep only specific columns and filters the data for the year 2022
 * 
 * @param {string} inputFile - The path to the initial CSV file
 * @param {string} outputFile - The path to the trimmed CSV file
 * @returns {Promise} - A promise that resolves when the trimming is complete
 * 
 * @author Maara Vanessa Purici
 */
export async function trimAccidentData(inputFile, outputFile) {
  // The columns we want to keep
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
    // Creating a writable stream that writes data to the specified CSV file
    const writeStream = fs.createWriteStream(outputFile);
    // Writing headers for the new CSV file
    writeStream.write(columnsToKeep.join(',') + '\n'); 

    // Creating a readable stream that read data from the specified CSV file
    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (accident) => {
        // This code runs each time data is available to read
        const startTime = new Date(accident['Start_Time']);
        const startYear = startTime.getFullYear();
        // Filtering the data for year 2022
        if (startYear == 2022) {
          const trimmedRow = columnsToKeep.map((col) => accident[col] || '').join(',');
          writeStream.write(trimmedRow + '\n');
        }
      })
      .on('end', () => {
        // This code runs when all the data has been read
        writeStream.end();
        console.log(`Trimmed accident data saved to ${outputFile}`);
        resolve();
      })
      .on('error', (error) => reject(error));
  });
}

/**
 * This function is used to trim the CSV file containing the weather events
 * to keep only specific columns and filters the data for the year 2022
 * 
 * @param {string} inputFile - The path to the initial CSV file
 * @param {string} outputFile - The path to the trimmed CSV file
 * @returns {Promise} - A promise that resolves when the trimming is complete
 * 
 * @author Maara Vanessa Purici
 */
export async function trimWeatherData(inputFile, outputFile) {
  // The columns we want to keep
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
    // Creating a writable stream that writes data to the specified CSV file
    const writeStream = fs.createWriteStream(outputFile);
    // Writing headers for the new CSV file
    writeStream.write(columnsToKeep.join(',') + '\n');

    // Creating a readable stream that read data from the specified CSV file
    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (weather) => {
        // This code runs each time data is available to read
        const startTime = new Date(weather['StartTime(UTC)']);
        const startYear = startTime.getFullYear();
        // Filtering the data for year 2022
        if (startYear == 2022) {
          const trimmedRow = columnsToKeep.map((col) => weather[col] || '').join(',');
          writeStream.write(trimmedRow + '\n');
        }
      })
      .on('end', () => {
        // This code runs when all the data has been read
        writeStream.end();
        console.log(`Trimmed weather data saved to ${outputFile}`);
        resolve();
      })
      .on('error', (error) => reject(error));
  });
}

/**
 * This function is used to execute the trimming of both accidents and weather datasets CSV files
 * 
 * @returns {Promise} - A promise that resolves when both CSV files have been processed
 * @author Maara Vanessa Purici
 */
async function trimCSVFiles() {
  try {
    // Triming both accidents and weather data
    await trimAccidentData(accidentsCsvPath, trimmedAccidentsPath);
    await trimWeatherData(weatherCsvPath, trimmedWeatherPath);
	
  } catch (error) {
    console.error('Error processing CSV files:', error);
  }
}

// Starts the triming process
trimCSVFiles();