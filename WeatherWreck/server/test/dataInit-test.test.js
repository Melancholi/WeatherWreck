// import * as chai from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// import fs from 'fs/promises';
// import { 
//   eventExistsInJson, 
//   readWeatherData, 
//   initializeJsonFiles, 
//   initializeCsvStreams, 
//   isDataMatching, 
//   addMatchingData, 
//   fixJsonFile } from '../data-init.mjs';

// chai.use(chaiAsPromised);
// const expect = chai.expect;
  
// // The path to the trimmed mock files
// const trimmedMockAccidents = '../db/mockData/trimmed_mock_accident_data.csv';
// const trimmedMockWeather = '../db/mockData/trimmed_mock_weather_data.csv';

// // The path to the output files for testing
// const matchedMockAccidentsJson = '../db/mockData/result/matched_mock_accident_data.json';
// const matchedMockAccidentsCsv = '../db/mockData/result/matched_mock_accident_data.json';

// const matchedMockWeatherJson = '../db/mockData/result/matched_mock_weather_data.csv';
// const matchedMockWeatherCsv = '../db/mockData/result/matched_mock_weather_data.csv';

// describe('Finding matches in the data', function() {
//   before(async function() {
//     // Cleaing up the previous output before tests
//     // Learned about this from here https://nodejs.org/api/fs.html#fspromisesrmpath-options
//     try {
//       await fs.rm(matchedMockAccidentsJson, { force: true });
//       await fs.rm(matchedMockAccidentsCsv, { force: true });
//       await fs.rm(matchedMockWeatherJson, { force: true });
//       await fs.rm(matchedMockWeatherCsv, { force: true });
//     } catch (error) {
//       console.error('Error during cleanup:', error);
//     }
//   });

// });