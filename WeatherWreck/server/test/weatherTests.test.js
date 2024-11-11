/* eslint-disable camelcase */
import * as chai from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import { db } from '../db/db.mjs';
import app from '../api.mjs';

const expect = chai.expect;

// Mock data for weather events to use in tests
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

// Tests for retrieving all weather events
describe('GET /weather', () => {
  before(()=>{
    const stubDB = sinon.stub(db, 'readAll');
    stubDB.resolves(mockWeatherEvents);
  });
  after(()=>{
    sinon.restore();
  });
  it('should retrieve all weather events', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
  it('should respond with status code 200', async () => {
    const response = await request(app).get('/api/weather');
    expect(response.status).to.equal(200);
  });
});

// Test error handling for weather events
describe('Error Handling for Weather Events', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    const stubDB = sinon.stub(db, 'readAll');
    stubDB.rejects(new Error('error'));
  });
  it('should handle errors when error thrown', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.body.error).to.equal('error');
  });
});

// Tests for retrieving weather events by date
describe('GET /weather/date/:date', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    const stubDB = sinon.stub(db, 'readByCondition');
    stubDB.resolves(mockWeatherEvents.slice(0, 1));
  });
  it('should retrieve weather events by date', async () => {
    const res = await request(app).get('/api/weather/date/2022-01-01');
    expect(res.body).to.deep.equal(mockWeatherEvents.slice(0, 1));
  });
  it('should respond with status code 200', async () => {
    const response = await request(app).get('/api/weather/date/2022-01-01');
    expect(response.statusCode).to.equal(200);
  });
});

// Tests for retrieving weather events by state
describe('GET /weather/state/:state', () => {
  it.skip('should retrieve weather events by state', async () => {
    const res = await request(app).get('/api/weather/type/storm');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
  it.skip('should respond with status code 200', async () => {
    const response = await request(app).get('/api/weather/type/storm');
    expect(response.statusCode).to.equal(200);
  });
});

// Tests for retrieving weather events by type
describe('GET /weather/type/:type', () => {
  it.skip('should retrieve weather events by type', async () => {
    const res = await request(app).get('/api/weather/type/storm');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
  it.skip('should respond with status code 200', async () => {
    const response = await request(app).get('/api/weather/type/storm');
    expect(response.statusCode).to.equal(200);
  });
});