import * as chai from './chai';
import request from "./supertest";
import sinon from './sinon';
import { db } from '../db/db.js';

const expect = chai.expect;

describe('Restoring original function',()=>{
  afterEach(()=>{
    sinon.restore();
  })
})

//Retrives all accidents
describe('GET /accidents', () => {
  it('should retrive all accidents', async()=>{
    const mockListAccidents = [{ /* Mock List*/ }]
    sinon.stub(db, 'readAll').resolves(mockListAccidents);

    const response = await request(app).get("/");
    expect(response.body).to.deep.equal([mockListAccidents]);
  })
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
    const mockListAccidents = [{ /* Mock List State Accidents */ }];
    sinon.stub(db, 'readByCondition').resolves(mockListAccidents);

    const res = await request(app).get('/accidents/state/california');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
});

// Retrieve accidents by date
describe('GET /accidents/date/:date', () => {
  it('should retrieve accidents by date', async () => {
    const mockListAccidents = [{ /* Mock List Date Accidents*/ }];
    sinon.stub(db, 'readByCondition').resolves(mockListAccidents);

    const res = await request(app).get('/accidents/date/2024-10-22');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
});

// Retrieve accidents by severity
describe('GET /accidents/severity/:severity', () => {
  it('should retrieve accidents by severity', async () => {
    const mockListAccidents = [{ /* Mock List Severity Accidents */ }];
    sinon.stub(db, 'readByCondition').resolves(mockListAccidents);

    const res = await request(app).get('/accidents/severity/high');
    expect(res.body).to.deep.equal(mockListAccidents);
  });
});

