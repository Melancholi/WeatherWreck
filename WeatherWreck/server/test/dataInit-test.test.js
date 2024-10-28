import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { 
  isDataMatching, 
} from '../data-init.mjs';
  
chai.use(chaiAsPromised);
const expect = chai.expect;
  
// The path to the trimmed mock files
// const trimmedMockAccidents = './db/mockData/trimmed_mock_accident_data.csv';
// const trimmedMockWeather = './db/mockData/trimmed_mock_weather_data.csv';

// The path to the output files for testing
// const matchedMockAccidentsCsv = './db/mockData/result/matched_mock_accident_data.csv';
// const matchedMockWeatherCsv = './db/mockData/result/matched_mock_weather_data.csv';

describe('Data Initialization and Matching Tests', function() {
  describe('Checking if even matches', function() {
    it('Should return true if the events match', function() {
      const accident = {
        'ID': 'A-01', 'State': 'CA', 'City': 'Los Angeles',
        'Severity': 2, 'Start_Time': '2022-10-01T10:00:00Z',
        'End_Time': '2022-10-01T11:00:00Z', 'Start_Lat': '34.0522',
        'Start_Lng': '-118.2437',  'Description': 'Accident description',
        'Street': 'Main St', 'End_lat': '34.0522',
        'End_Lng': '-118.2437', 'Distance(mi)': '1.0',
        'Weather_Condition': 'Cloudy'
      };
      const weather = {
        'EventId': 'W-01', 'State': 'CA', 'City': 'Los Angeles',
        'StartTime(UTC)': '2022-10-01T10:00:00Z',
        'EndTime(UTC)': '2022-10-01T11:00:00Z',
        'Severity': 1, 'Type': 'Rain', 'LocationLat': '30.0522',
        'LocationLng': '-108.2437', 'Precipitation(in)': '0.5'
      };

      let dataMatch = isDataMatching(accident, weather); 
      return expect(dataMatch).to.be.true;
    });

    it('Should return fasle if the events do not match', function() {
      const accident = {
        'ID': 'A-01', 'State': 'CA', 'City': 'Littlerock',
        'Severity': 2, 'Start_Time': '2022-10-01T10:00:00Z',
        'End_Time': '2022-10-01T11:00:00Z', 'Start_Lat': '34.0522',
        'Start_Lng': '-118.2437',  'Description': 'Accident description',
        'Street': 'Main St', 'End_lat': '34.0522',
        'End_Lng': '-118.2437', 'Distance(mi)': '1.0',
        'Weather_Condition': 'Light Rain'
      };
      const weather = {
        'EventId': 'W-01', 'State': 'CA', 'City': 'Los Angeles',
        'StartTime(UTC)': '2022-10-01T10:00:00Z',
        'EndTime(UTC)': '2022-10-01T11:00:00Z',
        'Severity': 1, 'Type': 'Rain', 'LocationLat': '30.0522',
        'LocationLng': '-108.2437', 'Precipitation(in)': '0.5'
      };

      let dataMatch = isDataMatching(accident, weather); 
      return expect(dataMatch).to.be.false;
    });
  });
});