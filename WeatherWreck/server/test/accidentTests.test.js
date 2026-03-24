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

// Constants for test URLs and data
const BASE_API = '/api/v1/accidents';
const CACHE_KEY_ALL = 'all_accidents';

// Mock data aligned with database aggregation pipeline output
// Database now returns formatted data with these exact field names
const mockListAccidents = [
  {
    AccidentID: 'A-756216',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Weather_Severity: 'Moderate',
    Accident_Severity: '3',
    Description: 'A minor fender bender',
    Start_Time: '2022-01-03 08:30',
    End_Time: '2022-01-03 09:15',
    State: 'OR',
    City: 'Portland',
    Date: '2022-01-03',
    Coordinates: ['-118.58980600000001', '45.581501']
  },
  {
    AccidentID: 'A-756542',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Weather_Severity: 'Moderate',
    Accident_Severity: '3',
    Description: 'Rear-end collision',
    Start_Time: '2022-01-03 10:00',
    End_Time: '2022-01-03 10:45',
    State: 'OR',
    City: 'Eugene',
    Date: '2022-01-03',
    Coordinates: ['-122.676643', '45.543568']
  }
];

const mockAccidentsState = [
  {
    AccidentID: 'A-3709602',
    WeatherID: 'W-537411',
    Weather_Condition: 'Fog',
    Weather_Severity: 'Moderate',
    Accident_Severity: '2',
    Description: 'Visibility collision',
    Start_Time: '2022-02-15 06:00',
    End_Time: '2022-02-15 06:30',
    State: 'CA',
    City: 'San Francisco',
    Date: '2022-02-15',
    Coordinates: ['-120.110109', '36.938262']
  },
  {
    AccidentID: 'A-3711976',
    WeatherID: 'W-537411',
    Weather_Condition: 'Fog',
    Weather_Severity: 'Moderate',
    Accident_Severity: '2',
    Description: 'Pile-up',
    Start_Time: '2022-02-15 07:00',
    End_Time: '2022-02-15 08:00',
    State: 'CA',
    City: 'Oakland',
    Date: '2022-02-15',
    Coordinates: ['-121.991661', '37.389788']
  }
];

const mockAccidentsDate = [
  {
    AccidentID: 'A-756216',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Weather_Severity: 'Moderate',
    Accident_Severity: '3',
    Description: 'A minor fender bender',
    Start_Time: '2022-01-03 08:30',
    End_Time: '2022-01-03 09:15',
    State: 'OR',
    City: 'Portland',
    Date: '2022-01-03',
    Coordinates: ['-118.58980600000001', '45.581501']
  },
  {
    AccidentID: 'A-756542',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Weather_Severity: 'Moderate',
    Accident_Severity: '3',
    Description: 'Rear-end collision',
    Start_Time: '2022-01-03 10:00',
    End_Time: '2022-01-03 10:45',
    State: 'OR',
    City: 'Eugene',
    Date: '2022-01-03',
    Coordinates: ['-122.676643', '45.543568']
  }
];

const mockAccidentsSeverity = [
  {
    AccidentID: 'A-756216',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Weather_Severity: 'High',
    Accident_Severity: '4',
    Description: 'Major collision',
    Start_Time: '2022-01-03 08:30',
    End_Time: '2022-01-03 09:15',
    State: 'OR',
    City: 'Portland',
    Date: '2022-01-03',
    Coordinates: ['-118.58980600000001', '45.581501']
  }
];

const mockAccidentsType = [
  {
    AccidentID: 'A-756216',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Weather_Severity: 'Moderate',
    Accident_Severity: '3',
    Description: 'A minor fender bender',
    Start_Time: '2022-01-03 08:30',
    End_Time: '2022-01-03 09:15',
    State: 'OR',
    City: 'Portland',
    Date: '2022-01-03',
    Coordinates: ['-118.58980600000001', '45.581501']
  },
  {
    AccidentID: 'A-756542',
    WeatherID: 'W-105145',
    Weather_Condition: 'Rain',
    Weather_Severity: 'Moderate',
    Accident_Severity: '3',
    Description: 'Rear-end collision',
    Start_Time: '2022-01-03 10:00',
    End_Time: '2022-01-03 10:45',
    State: 'OR',
    City: 'Eugene',
    Date: '2022-01-03',
    Coordinates: ['-122.676643', '45.543568']
  }
];

// Detail accident data with all fields
const mockDetailAccident = {
  AccidentID: 'A-756216',
  WeatherID: 'W-105145',
  Weather_Condition: 'Rain',
  Weather_Severity: 'Moderate',
  Accident_Severity: '3',
  Description: 'A minor fender bender',
  Start_Time: '2022-01-03 08:30',
  End_Time: '2022-01-03 09:15',
  State: 'NY',
  City: 'New York',
  Date: '2022-01-03',
  Coordinates: ['-118.58980600000001', '45.581501']
};

const mockListDetails = [mockDetailAccident];

// Test retrieving all accidents
describe('GET /accidents - Retrieve all accidents', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'generalFetchEventsAndAccidents').resolves(mockListAccidents);
  });
  
  afterEach(()=>{ 
    sinon.restore();
  });
  
  it('should retrieve all accidents with correct data format', async()=>{
    const response = await request(app).get(BASE_API);
    expect(response.body).to.deep.equal(mockListAccidents);
    expect(response.body).to.have.lengthOf(2);
  });
  
  it('should respond with status code 200 on success', async () => {
    const response = await request(app).get(BASE_API);
    expect(response.statusCode).to.equal(200);
  });
  
  it('should include cache control header', async () => {
    const response = await request(app).get(BASE_API);
    expect(response.headers['cache-control']).to.equal('max-age=31536000');
  });
});

// Test error handling for retrieving all accidents
describe('GET /accidents - Error handling', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'generalFetchEventsAndAccidents').
      rejects(new Error('Database connection failed'));
  });
  
  afterEach(()=>{
    sinon.restore();
  });
  
  it('should respond with 500 status on database error', async () => {
    const res = await request(app).get(BASE_API);
    expect(res.status).to.equal(500);
    expect(res.body.error).to.equal('Database connection failed');
  });
});

// Test no results found
describe('GET /accidents - No results', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'generalFetchEventsAndAccidents').resolves([]);
  });
  
  afterEach(()=>{
    sinon.restore();
  });
  
  it('should respond with 404 when no accidents found', async () => {
    const res = await request(app).get(BASE_API);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No accidents found');
  });
});

// Test retrieving accidents by state
describe('GET /accidents/state/:state - Retrieve by state', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves(mockAccidentsState);
  });
  
  afterEach(()=>{
    sinon.restore();
  });
  
  it('should retrieve accidents filtered by state', async () => {
    const res = await request(app).get(`${BASE_API}/state/CA`);
    expect(res.body).to.deep.equal(mockAccidentsState);
    expect(res.body[0].State).to.equal('CA');
  });
  
  it('should respond with status code 200 on success', async () => {
    const response = await request(app).get(`${BASE_API}/state/CA`);
    expect(response.statusCode).to.equal(200);
  });
  
  it('should normalize state parameter to uppercase', async () => {
    const res = await request(app).get(`${BASE_API}/state/ca`);
    expect(res.statusCode).to.equal(200);
    // Verify it still calls the database
    expect(db.fetchEventsAndAccidents.calledOnce).to.be.true;
  });
});

// Test error handling for invalid state
describe('GET /accidents/state/:state - Invalid or empty results', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves([]);
  });
  
  afterEach(()=>{
    sinon.restore();
  });
  
  it('should respond with 404 for state with no accidents', async () => {
    const res = await request(app).get(`${BASE_API}/state/XX`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No accidents found for XX');
  });
});

// Test retrieving accidents by date
describe('GET /accidents/date/:date - Retrieve by date', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves(mockAccidentsDate);
  });
  
  afterEach(()=>{
    sinon.restore();
  });
  
  it('should retrieve accidents filtered by date', async () => {
    const testDate = '2022-01-03';
    const res = await request(app).get(`${BASE_API}/date/${testDate}`);
    expect(res.body).to.deep.equal(mockAccidentsDate);
    expect(res.body[0].Date).to.equal(testDate);
  });
  
  it('should respond with status code 200 on success', async () => {
    const response = await request(app).get(`${BASE_API}/date/2022-01-03`);
    expect(response.statusCode).to.equal(200);
  });
});

// Test error handling for invalid date
describe('GET /accidents/date/:date - No accidents found', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves([]);
  });
  
  afterEach(()=>{
    sinon.restore();
  });
  
  it('should respond with 404 for date with no accidents', async () => {
    const res = await request(app).get(`${BASE_API}/date/2099-12-31`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No accidents found for 2099-12-31');
  });
});

// Test retrieving accidents by severity
describe('GET /accidents/severity/:severity - Retrieve by severity', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    const highSeverityAccidents = mockAccidentsSeverity.filter(a => a.Weather_Severity === 'High');
    sinon.stub(db, 'fetchEventsAndAccidents').resolves(highSeverityAccidents);
  });
  
  afterEach(()=>{
    sinon.restore();
  });
  
  it('should retrieve accidents filtered by weather severity', async () => {
    const res = await request(app).get(`${BASE_API}/severity/high`);
    expect(res.statusCode).to.equal(200);
    expect(res.body[0].Weather_Severity).to.equal('High');
  });
  
  it('should capitalize severity parameter', async () => {
    const res = await request(app).get(`${BASE_API}/severity/moderate`);
    expect(res.statusCode).to.equal(200);
  });
});

// Test error handling for invalid severity
describe('GET /accidents/severity/:severity - No accidents found', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves([]);
  });
  
  afterEach(()=>{
    sinon.restore();
  });
  
  it('should respond with 404 for severity with no accidents', async () => {
    const res = await request(app).get(`${BASE_API}/severity/extreme`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No accidents found for severity extreme');
  });
});

// Test retrieving accidents by weather type
describe('GET /accidents/type/:type - Retrieve by weather type', () => {
  beforeEach(()=>{
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves(mockAccidentsType);
  });
  
  afterEach(()=>{
    sinon.restore();
  });
  
  it('should retrieve accidents filtered by weather type', async () => {
    const res = await request(app).get(`${BASE_API}/type/rain`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal(mockAccidentsType);
  });
  
  it('should capitalize weather type parameter', async () => {
    const res = await request(app).get(`${BASE_API}/type/snow`);
    expect(res.statusCode).to.equal(200);
  });
});

// Test error handling for invalid weather type
describe('GET /accidents/type/:type - No accidents found', ()=>{
  beforeEach(() => {
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves([]);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should respond with 404 for weather type with no accidents', async () => {
    const res = await request(app).get(`${BASE_API}/type/unknown`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No accidents found for type unknown');
  });
});

// Test retrieving accident details
describe('GET /accidents/details/:accidentID/:weatherID - Retrieve accident details', ()=>{
  beforeEach(() => {
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves(mockListDetails);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should retrieve specific accident with all details', async () => {
    const res = await request(app).get(`${BASE_API}/details/A-756216/W-105145`);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.deep.equal(mockDetailAccident);
    expect(res.body.AccidentID).to.equal('A-756216');
  });

  it('should include all required fields in accident detail', async () => {
    const res = await request(app).get(`${BASE_API}/details/A-756216/W-105145`);
    expect(res.body).to.have.property('AccidentID');
    expect(res.body).to.have.property('Weather_Condition');
    expect(res.body).to.have.property('State');
    expect(res.body).to.have.property('Description');
  });
});

// Test error handling for accident details - no weather found
describe('GET /accidents/details/:accidentID/:weatherID - No weather found', ()=>{
  beforeEach(() => {
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves([]);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should respond with 404 when weather record not found', async () => {
    const res = await request(app).get(`${BASE_API}/details/A-756216/W-999999`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.equal('No details found for W-999999');
  });
});

// Test error handling for accident details - no accident found
describe('GET /accidents/details/:accidentID/:weatherID - No accident found', ()=>{
  beforeEach(() => {
    sinon.stub(cache, 'get').returns(null);
    sinon.stub(db, 'fetchEventsAndAccidents').resolves(mockListDetails);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should respond with 404 when accident ID not found in results', async () => {
    const res = await request(app).get(`${BASE_API}/details/A-999999/W-105145`);
    expect(res.status).to.equal(404);
    expect(res.body.error).to.include('something went wrong for A-999999');
  });
});