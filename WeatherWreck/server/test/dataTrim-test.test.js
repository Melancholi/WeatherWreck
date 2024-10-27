import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs/promises';
import fsp from 'fs';
import csv from 'csv-parser';
import { trimAccidentData, trimWeatherData } from '../data-trim.mjs';

chai.use(chaiAsPromised);
const expect = chai.expect;

// Path to the mock files
const mockAccidents = './db/mockData/mock_accident_data.csv';
const mockWeather = './db/mockData/mock_weather_data.csv';

// The path to the output files for testing
const trimmedMockAccidents = './db/mockData/trimmed_mock_accident_data.csv';
const trimmedMockWeather = './db/mockData/trimmed_mock_weather_data.csv';

describe('trimAccidentData', function() {
  before(async function() {
    // Cleaing up the previous output before tests
    // Learned about this from here https://nodejs.org/api/fs.html#fspromisesrmpath-options
    try {
      await fs.rm(trimmedMockAccidents, { force: true });
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });

  it('Should trim the accident data correctly', async function() {
    try {
      console.log('Starting to trim the accidents data');
      await trimAccidentData(mockAccidents, trimmedMockAccidents);
      const trimmedData = [];
      await new Promise((resolve, reject) => {
        const stream = fsp.createReadStream(trimmedMockAccidents).
          pipe(csv()).
          on('data', (weather) => {
            trimmedData.push(weather);
          }).
          on('end', resolve).
          on('error', reject);
        
        // Properly handle cleanup of the stream
        stream.on('close', () => {
          console.log('Stream closed.');
        });
      });

      // Verifing headers
      const headers = Object.keys(trimmedData[0]);
      expect(headers).to.deep.equal([
        'ID', 'State', 'City', 'Severity', 'Start_Time', 'End_Time', 
        'Start_Lat', 'Start_Lng', 'Description', 'Street', 
        'End_lat', 'End_Lng', 'Distance(mi)', 'Temperature(F)'
      ]);
      
      // Checking that at least one 2022 entry exists
      let found2022Entry = false;
      let found2021Entry = false;

      for (const row of trimmedData) {
        if (row.ID === 'A-512230') {
          found2022Entry = true;
        }
        if (row.Start_Time.includes('2021')) {
          found2021Entry = true;
        }
      }
      // Ensuring a 2022 entry exists
      expect(found2022Entry).to.be.true;
      // Ensuring no 2021 data was added
      expect(found2021Entry).to.be.false;

      console.log('Finished trimming the accident data');
    } catch (error) {
      console.error('Error trimming the accident data: ', error);
      throw error;
    }
  });
});

describe('trimWeatherData', function() {
  before(async function() {
    // Cleaing up the previous output before tests
    // Learned about this from here https://nodejs.org/api/fs.html#fspromisesrmpath-options
    try {
      await fs.rm(trimmedMockWeather, { force: true });
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });

  it('Should trim the weather data correctly', async function() {
    try {
      console.log('Starting to trim the weather data');
      await trimWeatherData(mockWeather, trimmedMockWeather);
      const trimmedData = [];
      await new Promise((resolve, reject) => {
        const stream = fsp.createReadStream(trimmedMockWeather).
          pipe(csv()).
          on('data', (weather) => {
            trimmedData.push(weather);
          }).
          on('end', resolve).
          on('error', reject);
        
        // Properly handle cleanup of the stream
        stream.on('close', () => {
          console.log('Stream closed.');
        });
      });

      // Verifing headers
      const headers = Object.keys(trimmedData[0]);
      expect(headers).to.deep.equal([
        'EventId', 'State', 'City', 'StartTime(UTC)', 'EndTime(UTC)', 
        'Severity', 'Type', 'LocationLat', 'LocationLng', 'Precipitation(in)'
      ]);
      
      // Checking that at least one 2022 entry exists
      let found2022Entry = false;
      let found2021Entry = false;

      for (const row of trimmedData) {
        if (row.EventId === 'W-2229') {
          found2022Entry = true;
        }
        if (row['StartTime(UTC)'].includes('2021')) {
          found2021Entry = true;
        }
      }
      // Ensuring a 2022 entry exists
      expect(found2022Entry).to.be.true;
      // Ensuring no 2021 data was added
      expect(found2021Entry).to.be.false;

      console.log('Finished trimming the weather data');
    } catch (error) {
      console.error('Error trimming the weather data: ', error);
      throw error;
    }
  });
});