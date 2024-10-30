import { db } from '../db/db.js';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { MongoClient } from 'mongodb';
import sinon from 'sinon';

const expect = chai.expect;
chai.use(chaiAsPromised);

const stubDBCreate = sinon.stub(db, 'create');
const stubDBCreateMany = sinon.stub(db, 'createMany')
const stubDBReadAll = sinon.stub(db, 'readAll');

const mockAccidentsList = [];
const mockWeatherList = [];

describe('Testing create method', function() {
  // Mock accident data to add
  const mockAccident = {
    'ID': 'A-01', 'State': 'QC', 'City': 'Montreal',
    'Start_Time': '2022-10-29 17:27:30',
    'End_Time': '2022-10-29 23:59:00',
    'Start_Lat': 41.946796, 'Start_Lng': -88.208092,
    'Description': 'Mock accident for the test',
    'Street': 'Just A Test', 'Distance': 0.1,
    'Weather_Condition': 'Cloudy'
  };

  before(() => {
    // Stubbing the create, createMany and readAll functions
    stubDBCreate.resolves({ insertedId: 'A-01' });
  });

  after(() => {
    stubDBCreate.restore();
  });

  it('Should respond with a 201', async function() {
    const response = await response(app)
      .post('/new-accident')
      .send(mockAccident)
      .set('Accept', 'application/json');

    expect(response.statusCode).to.equal(201);
  });

});

describe('Tetsing createMany method', function() {
  // Mock weather data to add
  const mockWeather = [
    {
      'EventId': 'W-01', 'State':'CO', 'City': 'Saguache',
      'StartTime': '2022-01-01 12:34:00',
      'EndTime': '2022-01-01 15:54:00',
      'Severity': 'Light', 'Type': 'Snow',
      'LocationLat': 38.0972, 'LocationLng': -106.1689,
      'Precipitation': 0.0
    },
    {
      'EventId': 'W-02', 'State':'CO', 'City': 'Saguache',
      'StartTime': '2022-01-01 05:34:00',
      'EndTime': '2022-01-01 11:54:00',
      'Severity': 'Light', 'Type': 'Cloudy',
      'LocationLat': 50.0972, 'LocationLng': -70.1689,
      'Precipitation': 0.0
    }
  ];

  before(() => {
    // Stubbing the create, createMany and readAll functions
    stubDBCreateMany.resolves(mockWeather);
  });

  after(() => {
    stubDBCreateMany.restore();
  });
  
}); 