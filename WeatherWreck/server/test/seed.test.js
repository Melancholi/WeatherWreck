import { getFilePaths, formatFile } from '../util/seed.js';
import fs from 'fs/promises';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import path from 'path';

const expect = chai.expect;
chai.use(chaiAsPromised);

/**
 * Tests for database seeding functionality
 * 
 * @author Maara Vanessa Purici
 */
describe('Database seed tests', function() {
  const folderPath = path.join('./db', '/mockData');
  let readdirStub;

  /**
   * Before each test, this function is used to set up the 
   * stub for fs.readdir
   * 
   * @author Maara Vanessa Purici
   */
  beforeEach(() => {
    readdirStub = sinon.stub(fs, 'readdir');
  });

  /**
   * After each test, this function is used to restore the stubbed 
   * methods to their original state
   * 
   * @author Maara Vanessa Purici
   */
  afterEach(() => {
    readdirStub.restore();
  });

  /**
   * Testing the getFilePath method
   * Contains tests that check if the file path retrieval is correct
   * and error handling if it's not 
   * 
   * @author Maara Vanessa Purici
   */
  describe('Testing the getFilePaths method', function() {
    /**
     * Tests that the getFilePaths method returns the correct file paths
     * when the directory contains files
     * 
     * @author Maara Vanessa Purici
     */
    it('Should return file paths correctly', async function() {
      const mockFiles = ['trimmed_mock_accident_data.csv', 'trimmed_mock_weather_data.csv'];
      readdirStub.resolves(mockFiles);

      const result = await getFilePaths(folderPath);
      expect(result).to.deep.equal([
        path.join(folderPath, 'trimmed_mock_accident_data.csv'),
        path.join(folderPath, 'trimmed_mock_weather_data.csv')
      ]);
    });

    /**
     * Tests that handles the errors and returns an empty array when an error 
     * occurs in the getFilePath method
     * 
     * @author Maara Vanessa Purici
     */
    it('Should handle errors and return an empty array', async function() {
      readdirStub.rejects(new Error('Directory not found'));

      const result = await getFilePaths(folderPath);
      expect(result).to.deep.equal([]);
    });

  });

  /**
   * Testing the formatFile method
   * Contains tests to ensure that the data is formated correctly
   * 
   * @author Maara Vanessa Purici
   */
  describe('Testing the formatFile method', function() {
    /**
     * Test that makes sure the accident data is formated correclty
     * 
     * @author Maara Vanessa Purici
     */
    it('Should format CarAccidents data correctly', function() {
      const mockAccidentRow = {
        'ID': 'A-01', 'State': 'TE', 'City': 'Test',
        'Start_Time': '2022-10-29 17:27:30',
        'End_Time': '2022-10-29 23:59:00',
        'Start_Lat': 41.946796, 'Start_Lng': -88.208092,
        'End_Lat': 41.947796, 'End_Lng': -88.209092
      };
      
      const formattedData = formatFile(mockAccidentRow, 'CarAccidents');

      expect(formattedData).to.deep.include({
        'Accident_Key': 'A-01', 'State': 'TE', 'City': 'Test',
        'Date': '2022-10-29',
        'Start_Time': '17:27:30',
        'End_Time': '23:59:00',
        'Start_Point': [-88.208092, 41.946796],
        'End_Point': [-88.209092, 41.947796]
      });
      expect(formattedData).to.not.have.property('Start_Lat');
      expect(formattedData).to.not.have.property('End_lat');
    });
    
    /**
     * Test that makes sure the weather data is formated correclty
     * 
     * @author Maara Vanessa Purici
     */
    it('Should format WeatherForecast data correctly', function() {
      const mockWeather = {
        'EventId': 'W-01', 'State':'TE', 'City': 'Test',
        'StartTime(UTC)': '2022-01-01 12:34:00',
        'EndTime(UTC)': '2022-01-01 15:54:00',
        'Severity': 'Light', 'Type': 'Snow',
        'LocationLat': 38.0972, 'LocationLng': -106.1689,
        'Precipitation(in)': 0.0
      };
      
      const formattedData = formatFile(mockWeather, 'WeatherForecast');

      expect(formattedData).to.deep.include({
        'Weather_Key': 'W-01', 'State':'TE', 'City': 'Test',
        'StartTime(UTC)': '12:34:00', 'EndTime(UTC)': '15:54:00',
        'Severity': 'Light', 'Type': 'Snow',
        'Precipitation(in)': 0.0,
        'Date': '2022-01-01',
      });
      expect(formattedData).to.not.have.property('LocationLng');
      expect(formattedData).to.not.have.property('LocationLat');
    });
  });
});