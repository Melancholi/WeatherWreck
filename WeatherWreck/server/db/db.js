import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const dburl = process.env.ATLAS_URI;

let instance = null;

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
    instance.collections[collName] = await instance.db.collection(collName);
    console.log(`Collection ${collName} Established to MongoDB:${dbName}`);
  }
  /**
   * Closes the connection, setting the instance to null
   */
  async close(){
    await instance.client.close();
    instance = null;
  }

  // Data Manipulation
  /**
   * Returns all the data related to a collection
   * @param {string} collName The name of the collection to read
   */
  async readAll(collName){
    return await instance.collections[collName].find().toArray();
  }
  /**
   * Returns all the data related to a collection
   * @param {string} collName The name of the collection to read
   * @param {string} location 
   */
  async readByState(collName, location){
    return await instance.collections[collName].find({'location' : { $eq: location}}).toArray();
  }
  /**
   * Returns all the data related to a collection
   * @param {string} collName The name of the collection to read
   */
  async readByCity(collName, location){
    return await instance.collections[collName].find({'location' : { $eq: location}}).toArray();
  }
  /**
   * Returns all the data related to a collection
   * @param {string} collName The name of the collection to read
   */
  async readByTime(collName, time){
    return await instance.collections[collName].find({'time' : { $eq: time}}).toArray();
  }
  /**
   * inserts an object into the database
   * @param {JSON} event the data to be added
   */
  async create(collName, event) {
    return await instance.collections[collName].insertOne(event);
  }
  /**
   * inserts multiple objects into the database
   * @param {ArrayJSON} events the data to be added
   */
  async createMany(collName, events) {
    return await instance.collections[collName].insertMany(events);
  }
}

export const db = new DB();