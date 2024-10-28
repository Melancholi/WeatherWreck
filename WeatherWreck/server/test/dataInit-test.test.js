import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs/promises';
import fsp from 'fs';
import { 
  eventExists, 
  readCsvData,
  isDataMatching, 
  addMatchingData,
  matchAccidentsWithWeather
} from '../data-init.mjs';
  
chai.use(chaiAsPromised);
const expect = chai.expect;
  
// The path to the trimmed mock files
const trimmedMockAccidents = './db/mockData/trimmed_mock_accident_data.csv';
const trimmedMockWeather = './db/mockData/trimmed_mock_weather_data.csv';

// The path to the output files for testing
const matchedMockAccidentsCsv = './db/mockData/result/matched_mock_accident_data.csv';
const matchedMockWeatherCsv = './db/mockData/result/matched_mock_weather_data.csv';

describe('Data Initialization and Matching Tests', function() {
  // before(async function() {
  //   // Cleaing up the previous output before tests
  //   // Learned about this from here https://nodejs.org/api/fs.html#fspromisesrmpath-options
  //   try {
  //     await fs.rm(matchedMockAccidentsCsv, { force: true });
  //     await fs.rm(matchedMockWeatherCsv, { force: true });
  //   } catch (error) {
  //     console.error('Error during cleanup:', error);
  //   }
  // });

  describe('Checking if even matches', function() {
    it('Should return true if the events match', function() {
      const accident = {
        ID: 'A-01', State: 'CA', City: 'Los Angeles',
        Severity: 2, Start_Time: '2022-10-01T10:00:00Z',
        End_Time: '2022-10-01T11:00:00Z', Start_Lat: '34.0522',
        Start_Lng: '-118.2437',  Description: 'Accident description',
        Street: 'Main St', End_lat: '34.0522',
        End_Lng: '-118.2437', 'Distance(mi)': '1.0',
        'Temperature(F)': '75'
      };
      const weather = {
        EventId: 'W-01', State: 'CA', City: 'Los Angeles',
        'StartTime(UTC)': '2022-10-01T10:00:00Z',
        'EndTime(UTC)': '2022-10-01T11:00:00Z',
        Severity: 1, Type: 'Rain', LocationLat: '30.0522',
        LocationLng: '-108.2437', 'Precipitation(in)': '0.5'
      };

      let dataMatch = isDataMatching(accident, weather); 
      return expect(dataMatch).to.be.true;
    });

    it('Should return fasle if the events do not match', function() {
      const accident = {
        ID: 'A-01', State: 'CA', City: 'Littlerock',
        Severity: 2, Start_Time: '2022-10-01T10:00:00Z',
        End_Time: '2022-10-01T11:00:00Z', Start_Lat: '34.0522',
        Start_Lng: '-118.2437',  Description: 'Accident description',
        Street: 'Main St', End_lat: '34.0522',
        End_Lng: '-118.2437', 'Distance(mi)': '1.0',
        'Temperature(F)': '75'
      };
      const weather = {
        EventId: 'W-01', State: 'CA', City: 'Los Angeles',
        'StartTime(UTC)': '2022-10-01T10:00:00Z',
        'EndTime(UTC)': '2022-10-01T11:00:00Z',
        Severity: 1, Type: 'Rain', LocationLat: '30.0522',
        LocationLng: '-108.2437', 'Precipitation(in)': '0.5'
      };

      let dataMatch = isDataMatching(accident, weather); 
      return expect(dataMatch).to.be.false;
    });
  });

  describe('Adding matching events', function() {
    it('It should pass if matches added to the accidents CSV file', async function() {
      await matchAccidentsWithWeather(trimmedMockAccidents, trimmedMockWeather, matchedMockAccidentsCsv, matchedMockWeatherCsv);
      const weatherData = await readCsvData(matchedMockWeatherCsv);
      const accidentData = await readCsvData(matchedMockAccidentsCsv)

      const accident = {
        ID: 'A-512236', State: 'WA', City: 'Seattle',
        Severity: 3, Start_Time: '2022-11-20T10:30:00Z',
        End_Time: '2022-11-20T11:15:00Z', Start_Lat: '47.6062',
        Start_Lng: '-122.3321', Description: 'Collision on I-5 Northbound near Madison St.',
        Street: 'I-5 N', End_lat: '', End_Lng: '', 'Distance(mi)': '0.0',
        'Temperature(F)': '55.0'
      };
      const weather = {
          EventId: 'W-2238', State: 'WA', City: 'Seattle',
          'StartTime(UTC)': '2022-11-20T10:30:00Z',
          'EndTime(UTC)': '2022-11-20T11:15:00Z',
          Severity: 1, Type: 'Snow', LocationLat: '47.6062',
          LocationLng: '-122.3321', 'Precipitation(in)': '0.0'
      };

      expect(accidentData).to.include(accident);
      expect(weatherData).to.include(weather);
    });
  });

  // describe('Event exists in JSON', function() {
  //   it('Should return false if the event ID does not exist in the file in CSV files', async function() {
  //     const accidentCsvStream = initializeAccidentsStream(matchedMockAccidentsCsv);
  //     const weatherCsvStream  = initializeWeatherStream(matchedMockWeatherCsv);
  //     const accident = {
  //       ID: 'A-01',
  //       State: 'CA',
  //       City: 'Los Angeles',
  //       Severity: 2,
  //       Start_Time: '2022-10-01T10:00:00Z',
  //       End_Time: '2022-10-01T11:00:00Z',
  //       Start_Lat: '34.0522',
  //       Start_Lng: '-118.2437',
  //       Description: 'Accident description',
  //       Street: 'Main St',
  //       End_lat: '34.0522',
  //       End_Lng: '-118.2437',
  //       'Distance(mi)': '1.0',
  //       'Temperature(F)': '75'
  //     };
  //     const data = [];
  //     await new Promise((resolve, reject) => {
  //       const stream = fsp.createReadStream(accidentCsvStream).
  //         pipe(csv()).
  //         on('data', data.push(accident)).
  //         on('end', resolve).
  //         on('error', reject);
        
  //       // Properly handle cleanup of the stream
  //       stream.on('close', () => {
  //         console.log('Stream closed.');
  //       });
  //     });
  //     let foundEntry = false;
  //     for (const row of data) {
  //       if (row.ID === 'A-01') {
  //         foundEntry = true;
  //       }
  //     }
  //     return expect(foundEntry).to.be.true;
  //   });

  //   it('Should return true if the event ID does exist in the file in CSV files', async function() {
  //     const accidentCsvStream = initializeAccidentsStream(matchedMockAccidentsCsv);
  //     const weatherCsvStream  = initializeWeatherStream(matchedMockWeatherCsv);
  //     const weather = {
  //       EventId: 'W-01',
  //       State: 'CA',
  //       City: 'Los Angeles',
  //       'StartTime(UTC)': '2022-10-01T10:00:00Z',
  //       'EndTime(UTC)': '2022-10-01T11:00:00Z',
  //       Severity: 1,
  //       Type: 'Rain',
  //       LocationLat: '34.0522',
  //       LocationLng: '-118.2437',
  //       'Precipitation(in)': '0.5'
  //     };
  //     const data = [];
  //     await new Promise((resolve, reject) => {
  //       const stream = fsp.createReadStream(weatherCsvStream).
  //         pipe(csv()).
  //         on('data', data.push(weather)).
  //         on('end', resolve).
  //         on('error', reject);
        
  //       // Properly handle cleanup of the stream
  //       stream.on('close', () => {
  //         console.log('Stream closed.');
  //       });
  //     });
  //     let foundEntry = false;
  //     for (const row of data) {
  //       if (row.ID === 'W-01') {
  //         foundEntry = true;
  //       }
  //     }
  //     return expect(foundEntry).to.be.true;
  //   });
  // });

  // describe('Checking if data is matching', function() {
  //   it('Should return true for matching data', function () {
  //     const accident = {
  //       ID: 'A-01',
  //       State: 'CA',
  //       City: 'Los Angeles',
  //       Severity: 2,
  //       Start_Time: '2022-10-01T10:00:00Z',
  //       End_Time: '2022-10-01T11:00:00Z',
  //       Start_Lat: '34.0522',
  //       Start_Lng: '-118.2437',
  //       Description: 'Accident description',
  //       Street: 'Main St',
  //       End_lat: '34.0522',
  //       End_Lng: '-118.2437',
  //       'Distance(mi)': '1.0',
  //       'Temperature(F)': '75'
  //     };
  //     const weather = {
  //       EventId: 'W-01',
  //       State: 'CA',
  //       City: 'Los Angeles',
  //       'StartTime(UTC)': '2022-10-01T10:00:00Z',
  //       'EndTime(UTC)': '2022-10-01T11:00:00Z',
  //       Severity: 1,
  //       Type: 'Rain',
  //       LocationLat: '34.0522',
  //       LocationLng: '-118.2437',
  //       'Precipitation(in)': '0.5'
  //     };
  //     const result = isDataMatching(accident, weather);
  //     return expect(result).to.be.true;
  //   });

  //   it('Should return false for non-matching data', function () {
  //     const accident = {
  //       ID: 'A-01',
  //       State: 'CA',
  //       City: 'Los Angeles',
  //       Severity: 2,
  //       Start_Time: '2022-10-01T10:00:00Z',
  //       End_Time: '2022-10-01T11:00:00Z',
  //       Start_Lat: '40.0522',
  //       Start_Lng: '-90.2437',
  //       Description: 'Accident description',
  //       Street: 'Main St',
  //       End_lat: '34.0522',
  //       End_Lng: '-118.2437',
  //       'Distance(mi)': '1.0',
  //       'Temperature(F)': '75'
  //     };
  //     const weather = {
  //       EventId: 'W-01',
  //       State: 'CA',
  //       City: 'Los Angeles',
  //       'StartTime(UTC)': '2023-10-01T10:00:00Z',
  //       'EndTime(UTC)': '2023-10-01T11:00:00Z',
  //       Severity: 1,
  //       Type: 'Rain',
  //       LocationLat: '34.0522',
  //       LocationLng: '-118.2437',
  //       'Precipitation(in)': '0.5'
  //     };
  //     const result = isDataMatching(accident, weather);
  //     return expect(result).to.be.false;
  //   });
  // });

  // describe('Adds the matching data to the correct files', function() {
  //   it('Should add matching accident and weather data to JSON and CSV files', async function() {
  //     const accident = {
  //       ID: 'A-01',
  //       State: 'CA',
  //       City: 'Los Angeles',
  //       Severity: 2,
  //       Start_Time: '2023-10-01T10:00:00Z',
  //       End_Time: '2023-10-01T11:00:00Z',
  //       Start_Lat: '34.0522',
  //       Start_Lng: '-118.2437',
  //       Description: 'Accident description',
  //       Street: 'Main St',
  //       End_lat: '34.0522',
  //       End_Lng: '-118.2437',
  //       'Distance(mi)': '1.0',
  //       'Temperature(F)': '75'
  //     };

  //     const weather = {
  //       EventId: 'W-01',
  //       State: 'CA',
  //       City: 'Los Angeles',
  //       'StartTime(UTC)': '2023-10-01T10:00:00Z',
  //       'EndTime(UTC)': '2023-10-01T11:00:00Z',
  //       Severity: 1,
  //       Type: 'Rain',
  //       LocationLat: '34.0522',
  //       LocationLng: '-118.2437',
  //       'Precipitation(in)': '0.5'
  //     };

  //     const accidentCsvStream = initializeAccidentsStream(matchedMockAccidentsCsv);
  //     const weatherCsvStream  = initializeWeatherStream(matchedMockWeatherCsv);

  //     addMatchingData(accident, weather, accidentCsvStream, weatherCsvStream);

  //     // Read back the results to verify the addition'utf-8');
  //     const savedAccidentsCsv = await fs.readFile(accidentCsvStream);
  //     const savedWeatherCsv = await fs.readFile(weatherCsvStream);

  //     expect(savedAccidentsCsv).to.include('A-01');
  //     expect(savedWeatherCsv).to.include('W-01');
  //   });
  // });
});