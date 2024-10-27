import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs/promises';
import { trimAccidentData, trimWeatherData } from '../data-trim.mjs';

chai.use(chaiAsPromised);

// Path to the mock files
const mockAccidents = '../db/mockData/mock_accident_data.csv';
const mockWeather = '../db/mockData/mock_weather_data.csv';

// The path to the output files for testing
const trimmedMockAccidents = '../db/mockData/trimmed_mock_accident_data.csv';
const trimmedMockWeather = '../db/mockData/trimmed_mock_weather_data.csv';

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

});