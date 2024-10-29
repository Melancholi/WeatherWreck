/* eslint-disable camelcase */
import * as chai from './chai';
import request from './supertest';
import sinon from './sinon';
import { db } from '../db/db.mjs';
import app from '../api.mjs';

const expect = chai.expect;
const mockWeatherEvents = [
  {
    EventId: 'W-2229',
    State: 'CO',
    City: 'Saguache',
    StartTime: '2022-01-01 12:34:00',
    EndTime: '2022-01-01 15:54:00',
    Severity: 'Light',
    Type: 'Snow',
    LocationLat: 38.0972,
    LocationLng: -106.1689,
    Precipitation_in: 0.0
  },
  {
    EventId: 'W-2230',
    State: 'CO',
    City: 'Saguache',
    StartTime: '2022-01-01 16:15:00',
    EndTime: '2022-01-01 17:14:00',
    Severity: 'Light',
    Type: 'Snow',
    LocationLat: 38.0972,
    LocationLng: -106.1689,
    Precipitation_in: 0.0
  },
  {
    EventId: 'W-2231',
    State: 'CO',
    City: 'Saguache',
    StartTime: '2022-01-06 06:54:00',
    EndTime: '2022-01-06 07:34:00',
    Severity: 'Severe',
    Type: 'Storm',
    LocationLat: 38.0972,
    LocationLng: -106.1689,
    Precipitation_in: 0.0
  },
  {
    EventId: 'W-2232',
    State: 'CO',
    City: 'Saguache',
    StartTime: '2022-01-08 21:14:00',
    EndTime: '2022-01-08 21:54:00',
    Severity: 'Light',
    Type: 'Snow',
    LocationLat: 38.0972,
    LocationLng: -106.1689,
    Precipitation_in: 0.0
  },
  {
    EventId: 'W-2233',
    State: 'CO',
    City: 'Saguache',
    StartTime: '2022-01-21 21:15:00',
    EndTime: '2022-01-21 22:55:00',
    Severity: 'Light',
    Type: 'Snow',
    LocationLat: 38.0972,
    LocationLng: -106.1689,
    Precipitation_in: 0.0
  },
  {
    EventId: 'W-2235',
    State: 'TX',
    City: 'Dallas',
    StartTime: '2022-09-08 18:45:00',
    EndTime: '2022-09-08 20:00:00',
    Severity: 'Severe',
    Type: 'Storm',
    LocationLat: 32.7767,
    LocationLng: -96.797,
    Precipitation_in: 0.2
  },
  {
    EventId: 'W-2237',
    State: 'CA',
    City: 'Los Angeles',
    StartTime: '2022-02-15 22:10:00',
    EndTime: '2022-02-16 00:00:00',
    Severity: 'Heavy',
    Type: 'Rain',
    LocationLat: 34.0522,
    LocationLng: -118.2437,
    Precipitation_in: 0.5
  }
];

describe('Restoring original function', ()=>{
  afterEach(()=>{
    sinon.restore();
  });
});

//Retrieve all weather events
describe('GET /weather', () => {
  it('should retrieve all weather events', async () => {
    sinon.stub(db, 'readAll').resolves(mockWeatherEvents);

    const res = await request(app).get('/weather');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
});

// Error handling for weather events
describe('Error Handling for Weather Events', () => {
  it('should handle errors when error thrown', async () => {
    sinon.stub(db, 'readAll').rejects(new Error('Error'));

    const res = await request(app).get('/weather');
    expect(res.body.error).to.equal('Error');
  });
});

// Retrieve weather events by date
describe('GET /weather/date/:date', () => {
  it('should retrieve weather events by date', async () => {
    sinon.stub(db, 'readByCondition').resolves(mockWeatherEvents);

    const res = await request(app).get('/weather/date/2024-10-20');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
});

// Retrieve weather events by state
describe('GET /weather/state/:state', () => {
  it('should retrieve weather events by state', async () => {
    sinon.stub(db, 'readByCondition').resolves(mockWeatherEvents);

    const res = await request(app).get('/weather/state/texas');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
});

// Retrieve weather events by type
describe('GET /weather/type/:type', () => {
  it('should retrieve weather events by type', async () => {
    sinon.stub(db, 'readByCondition').resolves(mockWeatherEvents);

    const res = await request(app).get('/weather/type/storm');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
});