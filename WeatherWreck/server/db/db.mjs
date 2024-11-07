import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const dburl = process.env.ATLAS_URI || 'mongodb://localhost:27017/test';

let instance = null;

function parseTime(date, time){
  return new Date(`${date}T${time}`);
}
function matchDateAndLocation(accident, event){
  return (
    accident.state === event.state &&
    accident.city === event.city &&
    accident.date === event.date
  );
}
function checkTimeOverlap(accident, event){
  const accidentStart = parseTime(accident.Date, accident.Start_Time);
  const weatherStart = parseTime(event.Date, event['StartTime(UTC)']);

  return weatherStart <= accidentStart;
}
function isMatch(accident, event){
  return matchDateAndLocation(accident, event) && checkTimeOverlap(accident, event); 
}

/**
 * Creates new object from information from both event, and accident
 * @returns {Object} Complete description accident object
 */
function formatData(event, accident){
  return  {
    'WeatherID': event.EventId,
    'AccidentID': accident.ID,
    'State' : accident.State,
    'City' : accident.City,
    'Description' : accident.Description,
    'Start_Time' : accident.Start_Time,
    'End_Time' : accident.End_Time,
    'Date' : accident.Date,
    'Weather_Severity' : event.Severity,
    'Accident_Severity' : accident.Severity,
    'Weather_Condition' : event.Type,
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
    if(!instance){
      instance = this;
      this.client = new MongoClient(dburl, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      }
      );
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
  async connect(dbName){
    //rework this to check for the same collection and one db connection
    if (instance.db){
      return;
    }
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
    await instance.client.close();
    instance.db = null;
    instance.collections = {};
    instance = null;
    console.log('Connection closed');
  }

  // Data Manipulation
  /**
   * Returns all the data related to a collection
   * @param {string} collName The name of the collection to read
   */
  async readAll(collName){
    if (!instance.collections[collName]) {
      throw new Error(`Collection ${collName} not opened. Call open() first.`);
    }
    return await instance.collections[collName].find().toArray();
  }
  /**
   * General method to read documents based on a query
   * @param {Object} query - The MongoDB query object specifying search conditions
   * @param {string} collName The name of the collection to read
   * @returns {Array} The matching documents
   * @example
   * const read = await db.readByCondition('CarAccidents' ,{State: 'IL',City: 'Bartlett' })
   * 'You can also index the data'
   * read[0] -> {id:1323, desc: 'example single data', state: 'IL', city:'Bartlett'}
   */
  async readByCondition(collName, query) {
    if (!instance.collections[collName]) {
      throw new Error(`Collection ${collName} not opened.`);
    }
    return await instance.collections[collName].find(query).toArray();
  }
  
  async readByConditionMatch(collName1, collName2, query){
    if (!(instance.collections[collName1] && instance.collections[collName2])) {
      throw new Error(`Collection ${collName1, collName2} not opened.`);
    }
    const data = await Promise.all([collName1, collName2].map(async coll =>
      await this.readByCondition(coll, query)
    ));
    //depending on order of opening the connections
    const weatherEvents = !data[0][0]['ID'] ? data[0] : data[1];
    const carAccidents = weatherEvents === data[1] ? data[0] : data[1];
    
    //filter data and match it into array of objects mixed with data of two 
    //collections
    return weatherEvents.map(event =>{
      const accidents = carAccidents.filter(acc => isMatch(acc, event));
      return accidents.map(accident => formatData(event, accident));
    });
  }
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
}

export const db = new DB();