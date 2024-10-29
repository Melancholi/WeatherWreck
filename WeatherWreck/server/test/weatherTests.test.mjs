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

//Retrieve all weather events
  describe('GET /weather', () => {
    it('should retrieve all weather events', async () => {
      const mockWeatherEvents = [{ /* List Weather Events */ }];
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
    const mockWeatherEvents = [{ /* List Weather events Date */ }];
    sinon.stub(db, 'readByCondition').resolves(mockWeatherEvents);

    const res = await request(app).get('/weather/date/2024-10-20');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
});

// Retrieve weather events by state
describe('GET /weather/state/:state', () => {
  it('should retrieve weather events by state', async () => {
    const mockWeatherEvents = [{ /* List Weather events State */ }];
    sinon.stub(db, 'readByCondition').resolves(mockWeatherEvents);

    const res = await request(app).get('/weather/state/texas');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
});

 // Retrieve weather events by type
 describe('GET /weather/type/:type', () => {
  it('should retrieve weather events by type', async () => {
    const mockWeatherEvents = [{ /* List Weather events State  */ }];
    sinon.stub(db, 'readByCondition').resolves(mockWeatherEvents);

    const res = await request(app).get('/weather/type/storm');
    expect(res.body).to.deep.equal(mockWeatherEvents);
  });
});