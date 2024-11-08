import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const dburl = process.env.ATLAS_URI || 'mongodb://localhost:27017/test';

let instance = null;

/**
 * Converts the separate date and time into a Date object
 */
function parseTime(date, time){
  return new Date(`${date}T${time}`);
}

/**
 * Return weather an accident is from the same region and time as an
 * event
 */
function compareDateAndLocation(accident, event){
  return (
    accident.State === event.State &&
    accident.City === event.City &&
    accident.Date === event.Date
  );
}
/**
 * Checks if the accident happens after the weather event started
 */
function checkTimeOverlap(accident, event){
  const accidentStart = parseTime(accident.Date, accident.Start_Time);
  const weatherStart = parseTime(event.Date, event['StartTime(UTC)']);

  return weatherStart <= accidentStart;
}

/**
 * Checks if the accident happened while the weather event was taking place
 */
function isMatch(accident, event){
  return compareDateAndLocation(accident, event) && checkTimeOverlap(accident, event); 
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
    return await instance.collections[collName].find(query).limit(100).toArray();
  }
  
  /**
   * Extension of the readbyconditon method, matches the data fetched 
   * from 2 collections by query into a list of objects with data matching from 2
   * collections
   * @param {Object} query - The MongoDB query object specifying search conditions
   * @param {string} collName1 The name of the collection to read and match with the other
   * @param {string} collName2 The name of the collection to read and match with the other
   * @returns {ArrayObject} Array of matching data objects
   */
  async readByConditionMatch(collName1, collName2, query){
    if (!(instance.collections[collName1] && instance.collections[collName2])) {
      throw new Error(`Collection ${collName1, collName2} not opened.`);
    }
    const data = await Promise.all([collName1, collName2].map(async coll =>
      await this.readByCondition(coll, query)
    ));
    //depending on order of opening the connections
    const weatherEvents = !data[0][0]['Description'] ? data[0] : data[1];
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

  /**
 * Fetches events and matching accidents based on query filter
 * @param {Object} query - The query filter to be applied, e.g., { State: { $eq: "New York" } }
 */
  async fetchEventsAndAccidents(query) {
    // Step 1: Fetch events matching the query filter
    const events = await instance.collections['WeatherForecast'].aggregate([
      {
        $match: query  
        // Match based on state or other filter condition
      },
      {
        //Similar to joins in SQL databases
        $lookup: {
          from: 'CarAccidents',
          // set values from outside 
          let: { eventState: '$State', eventCity: '$City',
            eventDate: '$Date', eventStartTime: '$StartTime(UTC)' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$State', '$$eventState'] },
                    { $eq: ['$Date', '$$eventDate'] }
                  ]
                }
              }
            },
          ],
          // name data
          as: 'matchingAccidents'
        }
      },
      {
        //what the document to return will look like
        $project: {
          EventId: 1,
          Type: 1,
          Severity: 1,
          City: 1,
          State: 1,
          Date: 1,
          StartTime: 1,
          //array of matche data
          matchingAccidents: 1
        }
      },
      {
        //do this search 25 times -> array of 25 events with x amt matching events
        $limit:25
      }
    ]).toArray();

    // Step 2: Process each event and its matching accidents
    const formattedResults = events.map(event => {
      return event.matchingAccidents.map(accident => {
        return {
          //ids are not returned, might be because of name that includes id
          AccidentID: accident['ID'],
          WeatherID: event['EventId'],
          'Weather_Condition': event.Type,
          'Weather_Severity': event.Severity,
          'Accident_Severity': accident.Severity,
          Description: accident.Description,
          'Start_Time': accident.Start_Time,
          'End_Time': accident.End_Time,
          State: event.State,
          City: event.City,
          Date: event.Date,
        };
      });
    });
    return formattedResults;
  }

}

export const db = new DB();

// CHANGE ID FOR EVENTS AND ACCIDENTS TO SMT ELSE STUPID THING
// FIX END_LAT BEING IN DB
// FIX END POINT[2] BEING NULL DAMN IT
// GIVE STRUCTURE TO DATA