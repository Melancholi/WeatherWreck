/* eslint-disable camelcase */
import request from 'supertest';
import sinon from 'sinon';
import { db } from '../db/db.mjs';
import app from '../api.mjs';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import cache from 'memory-cache';

chai.use(chaiAsPromised);
const expect = chai.expect;
// Mock data for accident records
const mockListAccidents = [
  {
    'AccidentID': 'A-756216',
    'WeatherID': 'W-105145',
    'Weather_Condition': 'Rain',
    'Coordinates': [
      '-118.58980600000001',
      '45.581501'
    ],
    'Date': '2022-01-03',
    'Weather_Severity': 'Moderate',
    'Accident_Severity': '3'
  },
  {
    'AccidentID': 'A-756542',
    'WeatherID': 'W-105145',
    'Weather_Condition': 'Rain',
    'Coordinates': [
      '-122.676643',
      '45.543568'
    ],
    'Date': '2022-01-03',
    'Weather_Severity': 'Moderate',
    'Accident_Severity': '3'
  },
];
//Format for data returned from fetches of state, date
const mockAccidentsState = [
  {
    AccidentID: 'A-3709602',
    WeatherID: 'W-537411',
    Weather_Condition: 'Fog',
    Coordinates: ['-120.110109', '36.938262'],
    State: 'CA'
  },
  {
    AccidentID: 'A-3711976',
    WeatherID: 'W-537411',
    Weather_Condition: 'Fog',
    Coordinates: ['-121.991661', '37.389788'],
    State: 'CA'
  }
];
const mockAccidentsDate = [
  {
    AccidentID: 'A-756216',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Coordinates: ['-118.58980600000001', '45.581501'],
    'Date': '2022-01-03',
  },
  {
    AccidentID: 'A-756542',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Coordinates: ['-122.676643', '45.543568'],
    'Date': '2022-01-03',
  }
];
const mockAccidentsSeverity = [
  {
    AccidentID: 'A-756216',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Coordinates: ['-118.58980600000001', '45.581501'],
    'Weather_Severity': 'High',
  },
  {
    AccidentID: 'A-756542',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Coordinates: ['-122.676643', '45.543568'],
    'Weather_Severity': 'Moderate',
  }
];
const mockListDetails = [
  {
    'AccidentID': 'A-756216',
    'WeatherID': 'W-105145',
    'Weather_Condition': 'Rain',
    'Coordinates': [
      '-118.58980600000001',
      '45.581501'
    ],
    'Date': '2022-01-03',
    'Weather_Severity': 'Moderate',
    'Accident_Severity': '3',
    'State': 'NY',
    'City': 'New York',
    'Description': 'A minor fender bender'
  },
  {
    'AccidentID': 'A-756542',
    'WeatherID': 'W-105145',
    'Weather_Condition': 'Rain',
    'Coordinates': [
      '-122.676643',
      '45.543568'
    ],
    'Date': '2022-01-03',
    'Weather_Severity': 'Moderate',
    'Accident_Severity': '3',
    'State': 'NY',
    'City': 'New York',
    'Description': 'A minor fender bender'
  },
];
const formatData = (accidents) =>{ 
  return accidents.map((accident) =>{
    const formattedAccident = {};
    Object.entries(accident).map(([key, value]) => {
      formattedAccident[key.replace('_', '')] = value;
    });
    return formattedAccident;
  });
};
const formattedGeneralAccidents = formatData(mockListAccidents);
const formattedStateAccidents = formatData(mockAccidentsState);
const formattedDateAccidents = formatData(mockAccidentsDate);
const formattedSeverityAccidents = formatData(mockAccidentsSeverity);
const formattedTypeAccidents = [
  {
    AccidentID: 'A-756216',
    WeatherID: 'W-105145',
    WeatherCondition: 'Rain',
    Coordinates: ['-118.58980600000001', '45.581501']
  },
  {
    AccidentID: 'A-756542',
    WeatherID: 'W-105145',
    WeatherCondition: 'Rain',
    Coordinates: ['-122.676643', '45.543568']
  }
];
const formattedDetailAccident =  {
  'WeatherCondition': 'Rain',
  'Date': '2022-01-03',
  'WeatherSeverity': 'Moderate',
  'AccidentSeverity': '3',
  'State': 'NY',
  'City': 'New York',
  'Description': 'A minor fender bender'
};

// Test retrieving all accidents
describe('GET /accidents', () => {
  after(()=>{ 
    sinon.restore();
  });
  before(()=>{
    //ensure that the cache cannot return a value
    sinon.stub(cache, 'get').returns(null);
    const stubDB = sinon.stub(db, 'generalFetchEventsAndAccidents');
    stubDB.resolves(mockListAccidents);
  });
  it('should retrive all accidents', async()=>{
    const response = await request(app).get('/api/accidents');
    expect(response.body).to.deep.equal(formattedGeneralAccidents);
  });
  it('should respond with status code 200', async () => {
    const response = await request(app).get('/api/accidents');
    expect(response.statusCode).to.equal(200);
  });
});

// Test error handling for retrieving all accidents
describe('Error Handling for Accidents', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    sinon.stub(cache, 'get').returns(null);
    const stubDB = sinon.stub(db, 'generalFetchEventsAndAccidents');
    stubDB.rejects(new Error('error'));
  });
  it('should handle errors when error thrown', async () => {
    const res = await request(app).get('/api/accidents');
    expect(res.status).to.equal(500);
    expect(res.body.error).to.equal('error');
  });
});

// Test retrieving accidents by state
describe('GET /accidents/state/:state', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    sinon.stub(cache, 'get').returns(null);
    const stubDB = sinon.stub(db, 'fetchEventsAndAccidents');
    stubDB.resolves(mockAccidentsState);
  });
  it('should retrieve accidents by state', async () => {
    const res = await request(app).get('/api/accidents/state/CA');
    expect(res.body).to.deep.equal(formattedStateAccidents);
  });
  it('should respond with status code 200', async () => {
    const response = await request(app).get('/api/accidents/state/CA');
    expect(response.statusCode).to.equal(200);
  });
});

// Test error handling for retriving accidents by an invalid state
describe('GET /accidents/state/:state - invalid state', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    sinon.stub(cache, 'get').returns(null);
    const stubDB = sinon.stub(db, 'fetchEventsAndAccidents');
    // Resolving to an empty array to simulate no results
    stubDB.resolves([]);
  });
  it('should handle errors when error thrown for wrong state', async () => {
    const res = await request(app).get('/api/accidents/state/invalid');
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No accidents found for INVALID');
  });
});

// Test retrieving accidents by state
describe.skip('GET /accidents/date/:date', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    const stubDB = sinon.stub(db, 'readByCondition');
    // Resolving to an empty array to simulate no results
    stubDB.resolves(mockListAccidents.slice(0, 3));
  });
  it('should retrieve accidents by date', async () => {
    const res = await request(app).get('/api/accidents/date/2022-09-08');
    expect(res.body).to.deep.equal(mockListAccidents.slice(0, 3));
  });
  it('should respond with status code 200', async () => {
    const response = await request(app).get('/api/accidents/date/2022-09-08');
    expect(response.statusCode).to.equal(200);
  });
});

// Test error handling for retriving accidents by an invalid date
describe.skip('GET /accidents/date/:date - invalid date', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    const stubDB = sinon.stub(db, 'readByCondition');
    // Resolving to an empty array to simulate no results
    stubDB.resolves([]);
  });
  it('should handle errors when error thrown for wrong date', async () => {
    const res = await request(app).get('/api/accidents/date/2099-12-31');
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No accidents found for 2099-12-31');
  });
});

// Test retrieving accidents by severity
describe.skip('GET /accidents/severity/:severity', () => {
  it.skip('should retrieve accidents by severity', async () => {
    const res = await request(app).get('/api/accidents/severity/high');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
  it.skip('should respond with status code 200', async () => {
    const response = await request(app).get('/api/accidents/severity/high');
    expect(response.statusCode).to.equal(200);
  });
});

// Test error handling for retriving accidents by an invalid severity
describe.skip('GET /accidents/severity/:severity - invalid severity', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    const stubDB = sinon.stub(db, 'readByCondition');
    // Resolving to an empty array to simulate no results
    stubDB.resolves([]);
  });
  it('should handle errors when error thrown for wrong severity', async () => {
    const res = await request(app).get('/api/accidents/severity/5');
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No accidents found for severity 5');
  });
});

