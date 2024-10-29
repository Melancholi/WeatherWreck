/* eslint-disable camelcase */
import request from 'supertest';
import {expect} from 'chai';
import sinon from 'sinon';
import { db } from '../db/db.mjs';
import app from '../api.mjs';


// const expect = chai.expect;
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

describe('Restoring original function', ()=>{
  afterEach(()=>{
    sinon.restore();
  });
});

//Retrives all accidents
describe('GET /accidents', () => {
  it('should retrive all accidents', async()=>{
    sinon.stub(db, 'readAll').resolves(mockListAccidents);

    const response = await request(app).get('/');
    expect(response.body).to.deep.equal([mockListAccidents]);
  });
});

// Error handling for all accidents
describe('Error Handling for Accidents', () => {
  it('should handle errors when error thrown', async () => {
    sinon.stub(db, 'readAll').rejects(new Error('error'));

    const res = await request(app).get('/accidents');
    expect(res.status).to.equal(500);
    expect(res.body.error).to.equal('Big Error!');
  });
});

// Retrieve accidents by state
describe('GET /accidents/state/:state', () => {
  it('should retrieve accidents by state', async () => {
    sinon.stub(db, 'readByCondition').resolves(mockListAccidents);

    const res = await request(app).get('/accidents/state/california');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
});

// Retrieve accidents by date
describe('GET /accidents/date/:date', () => {
  it('should retrieve accidents by date', async () => {
    sinon.stub(db, 'readByCondition').resolves(mockListAccidents);

    const res = await request(app).get('/accidents/date/2024-10-22');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
});

// Retrieve accidents by severity
describe('GET /accidents/severity/:severity', () => {
  it('should retrieve accidents by severity', async () => {
    sinon.stub(db, 'readByCondition').resolves(mockListAccidents);

    const res = await request(app).get('/accidents/severity/high');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
});

