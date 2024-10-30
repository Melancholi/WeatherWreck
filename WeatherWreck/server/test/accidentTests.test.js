/* eslint-disable camelcase */
import request from 'supertest';
import sinon from 'sinon';
import { db } from '../db/db.mjs';
import app from '../api.mjs';
import * as chai from 'chai';
const expect = chai.expect;

const mockListAccidents = [
  {
    ID: 'A-512230',
    State: 'IL',
    City: 'Bartlett',
    Severity: 1,
    Start_Time: '2022-09-08 05:49:30',
    End_Time: '2022-09-08 06:34:53',
    Start_Lat: 41.946796,
    Start_Lng: -88.208092,
    Description: 'Crash on CR-11 Army Trail Rd at IL-59.',
    Street: 'Army Trail Rd',
    End_Lat: null,
    End_Lng: null,
    Distance_mi: 0.0,
    Weather_Condition: 'Cloudy'
  },
  {
    ID: 'A-512231',
    State: 'CA',
    City: 'Littlerock',
    Severity: 1,
    Start_Time: '2022-09-08 02:02:05',
    End_Time: '2022-09-08 04:31:32',
    Start_Lat: 34.521172,
    Start_Lng: -117.958076,
    Description: 'Crash on CA-138 Pearblossom Hwy at 96th St.',
    Street: 'Pearblossom Hwy',
    End_Lat: null,
    End_Lng: null,
    Distance_mi: 0.0,
    Weather_Condition: 'Cloudy'
  },
  {
    ID: 'A-512232',
    State: 'VA',
    City: 'Richmond',
    Severity: 1,
    Start_Time: '2022-09-08 05:14:12',
    End_Time: '2022-09-08 07:38:17',
    Start_Lat: 37.542839,
    Start_Lng: -77.441780,
    Description: 'Crash on 2nd St Northbound at Franklin St.',
    Street: 'N 2nd St',
    End_Lat: null,
    End_Lng: null,
    Distance_mi: 0.0,
    Weather_Condition: 'Cloudy'
  },
  {
    ID: 'A-512233',
    State: 'OH',
    City: 'Alliance',
    Severity: 1,
    Start_Time: '2022-09-08 06:22:57',
    End_Time: '2022-09-08 06:52:42',
    Start_Lat: 40.896629,
    Start_Lng: -81.178452,
    Description: 'Crash on US-62 Atlantic Blvd Westbound after OH-173 State St.',
    Street: 'Atlantic Blvd NE',
    End_Lat: null,
    End_Lng: null,
    Distance_mi: 0.0,
    Weather_Condition: 'Cloudy'
  },
  {
    ID: 'A-512236',
    State: 'WA',
    City: 'Seattle',
    Severity: 3,
    Start_Time: '2022-11-20 10:30:00',
    End_Time: '2022-11-20 11:15:00',
    Start_Lat: 47.6062,
    Start_Lng: -122.3321,
    Description: 'Collision on I-5 Northbound near Madison St.',
    Street: 'I-5 N',
    End_Lat: null,
    End_Lng: null,
    Distance_mi: 0.0,
    Weather_Condition: 'Cloudy'
  },
  {
    ID: 'A-512238',
    State: 'FL',
    City: 'Orlando',
    Severity: 2,
    Start_Time: '2022-02-28 13:00:00',
    End_Time: '2022-02-28 14:00:00',
    Start_Lat: 28.5383,
    Start_Lng: -81.3792,
    Description: 'Crash on I-4 Westbound near Exit 83.',
    Street: 'I-4 W',
    End_Lat: null,
    End_Lng: null,
    Distance_mi: 0.0,
    Weather_Condition: 'Cloudy'
  }
];

//Retrives all accidents
describe('GET /accidents', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    const stubDB = sinon.stub(db, 'readAll');
    stubDB.resolves(mockListAccidents);
  });
  it('should retrive all accidents', async()=>{
    const response = await request(app).get('/api/accidents');
    expect(response.body).to.deep.equal(mockListAccidents);
  });
  it('should respond with status code 200', async () => {
    const response = await request(app).get('/api/accidents');
    expect(response.status).to.equal(200);
  });
});

// Error handling for all accidents
describe('Error Handling for Accidents', () => {
  after(()=>{
    sinon.restore();
  });
  before(()=>{
    const stubDB = sinon.stub(db, 'readAll');
    stubDB.rejects(new Error('error'));
  });
  it('should handle errors when error thrown', async () => {
    const res = await request(app).get('/api/accidents');
    expect(res.status).to.equal(500);
    expect(res.body.error).to.equal('error');
  });
});

// Retrieve accidents by state
describe('GET /accidents/state/:state', () => {
  it.skip('should retrieve accidents by state', async () => {
    const res = await request(app).get('/api/accidents/state/california');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
  it.skip('should respond with status code 200', async () => {
    const response = await request(app).get('/accidents/state/california');
    expect(response.statusCode).to.equal(200);
  });
});

// Retrieve accidents by date
describe('GET /accidents/date/:date', () => {
  it.skip('should retrieve accidents by date', async () => {
    const res = await request(app).get('/api/accidents/date/2024-10-22');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
  it.skip('should respond with status code 200', async () => {
    const response = await request(app).get('/api/accidents/date/2024-10-22');
    expect(response.statusCode).to.equal(200);
  });
});

// Retrieve accidents by severity
describe('GET /accidents/severity/:severity', () => {
  it.skip('should retrieve accidents by severity', async () => {
    const res = await request(app).get('/api/accidents/severity/high');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
  it.skip('should respond with status code 200', async () => {
    const response = await request(app).get('/api/accidents/severity/high');
    expect(response.statusCode).to.equal(200);
  });
});

