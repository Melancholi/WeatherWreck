import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs/promises';
import { 
  eventExistsInJson, 
  readWeatherData, 
  initializeJsonFiles, 
  initializeCsvStreams, 
  isDataMatching, 
  addMatchingData, 
  fixJsonFile } from '../data-init.mjs';
  
chai.use(chaiAsPromised);
const expect = chai.expect;
  
// The path to the trimmed mock files
const trimmedMockAccidents = './db/mockData/trimmed_mock_accident_data.csv';
const trimmedMockWeather = './db/mockData/trimmed_mock_weather_data.csv';

// The path to the output files for testing
const matchedMockAccidentsJson = './db/mockData/result/matched_mock_accident_data.json';
const matchedMockAccidentsCsv = './db/mockData/result/matched_mock_accident_data.csv';

const matchedMockWeatherJson = './db/mockData/result/matched_mock_weather_data.json';
const matchedMockWeatherCsv = './db/mockData/result/matched_mock_weather_data.csv';

describe('Data Initialization and Matching Tests', function() {
  before(async function() {
    // Cleaing up the previous output before tests
    // Learned about this from here https://nodejs.org/api/fs.html#fspromisesrmpath-options
    try {
      await fs.rm(matchedMockAccidentsJson, { force: true });
      await fs.rm(matchedMockAccidentsCsv, { force: true });
      await fs.rm(matchedMockWeatherJson, { force: true });
      await fs.rm(matchedMockWeatherCsv, { force: true });
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });

  describe('Event exists in JSON', function() {
    it('Should return false if the file does not exist', function() {
      const result = eventExistsInJson('./nonexistent.json', '123');
      return expect(result).to.be.false;
    });

    it('Should return false if the event ID does not exist in the file in JSON files', async function() {
      const { accidentJsonFile, weatherJsonFile } = initializeJsonFiles(matchedMockAccidentsJson, matchedMockWeatherJson);
      const accident = {
        ID: 'A-01',
        State: 'CA',
        City: 'Los Angeles',
        Severity: 2,
        Start_Time: '2023-10-01T10:00:00Z',
        End_Time: '2023-10-01T11:00:00Z',
        Start_Lat: '34.0522',
        Start_Lng: '-118.2437',
        Description: 'Accident description',
        Street: 'Main St',
        End_lat: '34.0522',
        End_Lng: '-118.2437',
        'Distance(mi)': '1.0',
        'Temperature(F)': '75'
      };
      fs.writeFile(accidentJsonFile, JSON.stringify(accident, null, 2));
      const result = eventExistsInJson(accidentJsonFile, 'A-01');
      return expect(result).to.be.false;
    });

    it('Should return true if the event ID does exist in the file in JSON files', async function() {
      const { accidentJsonFile, weatherJsonFile } = initializeJsonFiles(matchedMockAccidentsJson, matchedMockWeatherJson);
      const weather = {
        EventId: 'W-01',
        State: 'CA',
        City: 'Los Angeles',
        'StartTime(UTC)': '2023-10-01T10:00:00Z',
        'EndTime(UTC)': '2023-10-01T11:00:00Z',
        Severity: 1,
        Type: 'Rain',
        LocationLat: '34.0522',
        LocationLng: '-118.2437',
        'Precipitation(in)': '0.5'
      };
      fs.writeFile(weatherJsonFile, JSON.stringify(weather, null, 2));
      const result = eventExistsInJson(weatherJsonFile, 'W-01');
      return expect(result).to.be.true;
    });
  });

  describe('Checking if data is matching', function() {
    it('Should return true for matching data', function () {
      const accident = {
        State: 'CA',
        City: 'Los Angeles',
        Start_Lat: '34.0522',
        Start_Lng: '-118.2437',
        Start_Time: '2023-10-01T10:00:00Z'
      };
      const weather = {
        State: 'CA',
        City: 'Los Angeles',
        LocationLat: '34.0522',
        LocationLng: '-118.2437',
        'StartTime(UTC)': '2023-10-01T10:00:00Z'
      };
      const result = isDataMatching(accident, weather);
      return expect(result).to.be.true;
    });

    it('Should return false for non-matching data', function () {
      const accident = {
        State: 'CA',
        City: 'Los Angeles',
        Start_Lat: '34.0522',
        Start_Lng: '-118.2437',
        Start_Time: '2023-10-01T10:00:00Z'
      };
      const weather = {
        State: 'NY',
        City: 'New York',
        LocationLat: '40.7128',
        LocationLng: '-74.0060',
        'StartTime(UTC)': '2023-10-01T10:00:00Z'
      };
      const result = isDataMatching(accident, weather);
      return expect(result).to.be.false;
    });
  });

  describe('Adds the matching data to the correct files', function() {
    it('Should add matching accident and weather data to JSON and CSV files', async function() {
      const accident = {
        ID: 'A-01',
        State: 'CA',
        City: 'Los Angeles',
        Severity: 2,
        Start_Time: '2023-10-01T10:00:00Z',
        End_Time: '2023-10-01T11:00:00Z',
        Start_Lat: '34.0522',
        Start_Lng: '-118.2437',
        Description: 'Accident description',
        Street: 'Main St',
        End_lat: '34.0522',
        End_Lng: '-118.2437',
        'Distance(mi)': '1.0',
        'Temperature(F)': '75'
      };

      const weather = {
        EventId: 'W-01',
        State: 'CA',
        City: 'Los Angeles',
        'StartTime(UTC)': '2023-10-01T10:00:00Z',
        'EndTime(UTC)': '2023-10-01T11:00:00Z',
        Severity: 1,
        Type: 'Rain',
        LocationLat: '34.0522',
        LocationLng: '-118.2437',
        'Precipitation(in)': '0.5'
      };

      const { accidentJsonFile, weatherJsonFile } = initializeJsonFiles(matchedMockAccidentsJson, matchedMockWeatherJson);
      const { accidentCsvStream, weatherCsvStream } = initializeCsvStreams(matchedMockAccidentsCsv, matchedMockWeatherCsv);

      addMatchingData(accident, weather, accidentCsvStream, weatherCsvStream, accidentJsonFile, weatherJsonFile);

      // Read back the results to verify the addition
      const savedAccidentsJson = await fs.readFile(accidentJsonFile, 'utf-8');
      const savedWeatherJson = await fs.readFile(weatherJsonFile, 'utf-8');
      const savedAccidentsCsv = await fs.readFile(accidentCsvStream, 'utf-8');
      const savedWeatherCsv = await fs.readFile(weatherCsvStream, 'utf-8');

      expect(JSON.parse(savedAccidentsJson)).to.include(accident);
      expect(JSON.parse(savedWeatherJson)).to.include(weather);
      expect(savedAccidentsCsv).to.include('A-01');
      expect(savedWeatherCsv).to.include('W-01');
    });
  });
});