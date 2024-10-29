import { db } from '../db/db.js';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { MongoClient } from 'mongodb';
import sinon from 'sinon';

chai.use(chaiAsPromised);

describe('Tetsing data insertion methods', function() {
  // mock data to add
  const mockAccident = [
    {
      'ID': 'A-01',
      'State': 'QC',
      'City': 'Montreal',
      'Start_Time': '2022-10-29 17:27:30',
      'End_Time': '2022-10-29 23:59:00',
      'Start_Lat': 41.946796,
      'Start_Lng': -88.208092,
      'Description': 'Mock accident for the test',
      'Street': 'Just A Test',
      'Distance': 0.1,
      'Weather_Condition': 'Cloudy'
    },
    {
      'ID': 'A-02',
      'State': 'NY',
      'City': 'New York',
      'Start_Time': '2022-10-29 13:27:30',
      'End_Time': '2022-10-29 23:50:00',
      'Start_Lat': 42.946796,
      'Start_Lng': -90.208092,
      'Description': 'Mock accident 2 for the test',
      'Street': 'Just A Test 2',
      'Distance': 0.0,
      'Weather_Condition': 'Snow'
    }
  ];

  const mockWeather = [
    {
      'EventId': 'W-01',
      'State':'CO',
      'City': 'Saguache',
      'StartTime': '2022-01-01 12:34:00',
      'EndTime': '2022-01-01 15:54:00',
      'Severity': 'Light',
      'Type': 'Snow',
      'LocationLat': 38.0972,
      'LocationLng': -106.1689,
      'Precipitation': 0.0
    },
    {
      'EventId': 'W-02',
      'State':'CO',
      'City': 'Saguache',
      'StartTime': '2022-01-01 05:34:00',
      'EndTime': '2022-01-01 11:54:00',
      'Severity': 'Light',
      'Type': 'Cloudy',
      'LocationLat': 50.0972,
      'LocationLng': -70.1689,
      'Precipitation': 0.0
    }
  ];

});