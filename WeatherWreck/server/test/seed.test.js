import { db } from '../db/db.js';
import { getFilePaths, formatFile } from '../util/seed.js';
import * as fs from 'fs/promises';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { MongoClient } from 'mongodb';
import sinon from 'sinon';

const expect = chai.expect;
chai.use(chaiAsPromised);

const folderPath = path.join('./db', '/mockData');

describe('Database seed tests', function() {
  describe('Testing the getFilePaths method', function() {
    let readdirStub;
    before(() => {
      readdirStub = sinon.stub(fs, 'readdir');
    });

    after(() => {
      readdirStub.restore();
    });

    it('Should return file paths correctly', async function() {
      const mockFiles = ['mock_accidents.csv', 'mock_weather.csv'];
      readdirStub.resolves(mockFiles);

      const result = await getFilePaths(folderPath);
      expect(result).to.deep.equal(mockFiles.map(file => path.join(folderPath, file)));
    });

    it('Should handle errors and return an empty array', async function() {
      readdirStub.rejects(new Error('Directory not found'));

      const result = await getFilePaths(folderPath);
      expect(result).to.deep.equal([]);
    });

  });

  describe('Testing the formatFile method', function() {
    it('Should format CarAccidnets data correctly', function() {
      const mockAccidentRow = {
        'ID': 'A-01', 'State': 'QC', 'City': 'Montreal',
        'Start_Time': '2022-10-29 17:27:30',
        'End_Time': '2022-10-29 23:59:00',
        'Start_Lat': 41.946796, 'Start_Lng': -88.208092,
        'End_lat': 41.947796, 'End_Lng': -88.209092
      };
      
      const formattedData = formatFile(mockAccidentRow, 'CarAccidents')

      expect(formattedData).to.deep.include({
        'ID': 'A-01', 'State': 'QC', 'City': 'Montreal',
        'Date': '2022-10-29',
        'Start_Time': '17:27:30',
        'End_Time': '23:59:00',
        'Start_Point': [-88.208092, 41.946796],
        'End_Point': [-88.209092, 41.947796]
      });
      expect(formattedData).to.not.have.property('Start_Lat');
      expect(formattedData).to.not.have.property('End_lat');
    });
    
    it('Should format WeatherForecast data correctly', function() {
      const mockWeather = {
        'EventId': 'W-01', 'State':'CO', 'City': 'Saguache',
        'StartTime': '2022-01-01 12:34:00',
        'EndTime': '2022-01-01 15:54:00',
        'Severity': 'Light', 'Type': 'Snow',
        'LocationLat': 38.0972, 'LocationLng': -106.1689,
        'Precipitation': 0.0
      };
      
      const formattedData = formatFile(mockWeather, 'WeatherForecast')

      expect(formattedData).to.deep.include({
        'EventId': 'W-01', 'State':'CO', 'City': 'Saguache',
        'Date': '2022-01-01',
        'StartTime(UTC)': '12:34:00',
        'EndTime(UTC)': '15:54:00',
        'Precipitation': 0.0
      });
      expect(formattedData).to.not.have.property('LocationLng');
      expect(formattedData).to.not.have.property('LocationLat');
    });
  });
});