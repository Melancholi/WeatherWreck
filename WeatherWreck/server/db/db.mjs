/* eslint-disable camelcase */
import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

let instance = null;

/**
 * @deprecated Use MongoDB aggregation pipeline $project instead.
 * Data transformation is now handled at database level for better performance.
 * See fetchEventsAndAccidents() and generalFetchEventsAndAccidents()
 * 
 * Creates new object from information from both event, and accident
 * @returns {Object} Complete description accident object
 */
function formatData(event, accident){
  return  {
    AccidentID: accident.Accident_Key,
    WeatherID: event.Weather_Key,
    'Weather_Condition': event.Type,
    'Weather_Severity': event.Severity,
    'Accident_Severity': accident.Severity,
    Description: accident.Description,
    'Start_Time': accident.Start_Time,
    'End_Time': accident.End_Time,
    State: event.State,
    City: event.City,
    Date: event.Date,
    Coordinates: accident.Start_Point
  };
}

/**
 * Database class, API that allows reading/writing to the mongodb
 */
class DB{
  //Connecting the DB
  /**
   * Creates the db client that will interact with the database and creates a 
   * db and collection object 
   * @proprety client : The client is used to manage the database, we use it
   * to connect to mongodb and also close it
   * @proprety db : The database connection 
   * that will allow us to get the collection
   * @proprety collection : The data from mongo db that we will interact with
   */
  constructor(){
    if (!instance) {
      instance = this;
      this.client = null;
      this.db = null;
      this.collections = {};
    }
    return instance;
  }

  /**
   * Establishes the connection with the database, creating/connecting to a
   * database if the db does not already exists.
   * @param {string} dbName the name of the cluster to access
   */
  async connect(dbName, dburl = process.env.ENV === 'docker' ? 
    process.env.DOCKER_ATLAS_URI : process.env.ATLAS_URI ){
    //rework this to check for the same collection and one db connection
    if (instance.db){
      return;
    }
    this.client = new MongoClient(dburl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await instance.client.connect();
    instance.db = await instance.client.db(dbName);
    //check for connection
    await instance.client.db(dbName).command({ping:1});
    console.log(`Connection Established to MongoDB:${dbName}`); 
  }
  /**
   * Creates a db collection in the previously created db
   * @param {string} collName the name of the collection to access
   */
  async open(collName){
    if (!instance.db){
      throw new Error(`Database not connected, unable to connect to ${collName}`);
    }
    instance.collections[collName] = await instance.db.collection(collName);
    console.log(`Collection ${collName} Established to MongoDB:${instance.db.databaseName}`);
  }
  /**
   * Closes the connection, setting the instance to null
   */
  async close(){
    if (instance.db){
      await instance.client.close();
      instance.db = null;
      instance.collections = {};
      instance = null;
      console.log('Connection closed');
    }
  }

  //Data Manipulation
  /**
   * inserts an object into the database
   * @param {JSON} event the data to be added
   *  @param {string} collName The name of the collection to read
   * @returns {Array} The matching documents
   */
  async create(collName, event) {
    if (!instance.collections[collName]) {
      throw new Error(`Collection ${collName} not opened.`);
    }
    return await instance.collections[collName].insertOne(event);
  }
  /**
   * inserts multiple objects into the database
   * @param {ArrayJSON} events the data to be added
   *  @param {string} collName The name of the collection to read
   * @returns {Array} The matching documents
   */
  async createMany(collName, events) {
    if (!instance.collections[collName]) {
      throw new Error(`Collection ${collName} not opened.`);
    }
    return await instance.collections[collName].insertMany(events);
  }

  /**
 * Fetches random matching events from all 50 states 
 * @returns {Array} Formatted accident data from all states
 */
  async generalFetchEventsAndAccidents(){
    // Reference: https://docs.mongodb.com/manual/reference/operator/aggregation/group/
    const events = await instance.collections['WeatherForecast'].aggregate([
      {
        // Group by state and take first event from each state
        $group: {
          _id: '$State',
          weatherEvent: { $first: '$$ROOT' }
        }
      },
      {
        // Replace root to flatten back to document level
        $replaceRoot: { newRoot: '$weatherEvent' }
      },
      {
        $lookup:{
          from:'CarAccidents',
          let: { eventState: '$State',
            eventDate: '$Date'},
          pipeline: [
            {
              $match:{
                $expr:{
                  $and: [
                    { $eq: ['$State', '$$eventState'] },
                    { $eq: ['$Date', '$$eventDate'] }
                  ]
                }
              }
            },
            {
              $limit:2,
            },
          ],
          as: 'matchingAccidents'
        }
      },
      {
        $project: {
          _id: 0,
          matchingAccidents: {
            $map: {
              input: '$matchingAccidents',
              as: 'accident',
              in: {
                AccidentID: '$$accident.Accident_Key',
                WeatherID: '$Weather_Key',
                Weather_Condition: '$Type',
                Weather_Severity: '$Severity',
                Accident_Severity: '$$accident.Severity',
                Description: '$$accident.Description',
                Start_Time: '$$accident.Start_Time',
                End_Time: '$$accident.End_Time',
                State: '$State',
                City: '$City',
                Date: '$Date',
                Coordinates: '$$accident.Start_Point'
              }
            }
          }
        }
      },
      {
        // Unwind to flatten array of matched accidents
        $unwind: '$matchingAccidents'
      },
      {
        // Return individual documents instead of nested array
        $replaceRoot: { newRoot: '$matchingAccidents' }
      }
    ]).toArray();
  
    return events;
  }

  /**
 * Fetches events and matching accidents based on query filter directly from db.
 * @param {Object} query - The query filter to be applied, e.g., { State: { $eq: "New York" } }
 * @note if no parameters are passed to the method, it will search for all cases
 * and return the matching data
 */
  async fetchEventsAndAccidents(query = { _id : {$exists:true}}) {
    const events = await instance.collections['WeatherForecast'].aggregate([
      {
        $match: query
      },
      {
        $lookup: {
          from: 'CarAccidents',
          let: { eventState: '$State', eventDate: '$Date'},
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$State', '$$eventState'] },
                    { $eq: ['$Date', '$$eventDate'] }
                  ]
                }
              },
            },
          ],
          as: 'matchingAccidents'
        }
      },
      {
        // Reference: https://docs.mongodb.com/manual/reference/operator/aggregation/project/
        $project: {
          _id: 0,
          matchingAccidents: {
            $map: {
              input: '$matchingAccidents',
              as: 'accident',
              in: {
                AccidentID: '$$accident.Accident_Key',
                WeatherID: '$Weather_Key',
                Weather_Condition: '$Type',
                Weather_Severity: '$Severity',
                Accident_Severity: '$$accident.Severity',
                Description: '$$accident.Description',
                Start_Time: '$$accident.Start_Time',
                End_Time: '$$accident.End_Time',
                State: '$State',
                City: '$City',
                Date: '$Date',
                Coordinates: '$$accident.Start_Point'
              }
            }
          }
        }
      },
      {
        $limit: 2
      },
      {
        // Unwind array to get individual accident documents
        // Reference: https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/
        $unwind: '$matchingAccidents'
      },
      {
        // Replace root to return formatted accidents directly
        // Reference: https://docs.mongodb.com/manual/reference/operator/aggregation/replaceRoot/
        $replaceRoot: { newRoot: '$matchingAccidents' }
      }
    ]).toArray();

    // Return already-formatted data from database aggregation
    return events;
  }
}


export const db = new DB();
