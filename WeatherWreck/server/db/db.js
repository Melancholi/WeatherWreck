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
      this.collection = null;
    }
    return instance;
  }

  /**
   * Establishes the connection with the database, creating/connecting to a
   * database and creating/accessing a collection, if the db or collection
   * does not already exists, it will create one for us to use
   * @param {string} dbName the name of the cluster to access
   * @param {string} collName the name of the collection to access
   */
  async connect(dbName, collName){
    if (instance.db){
      return;
    }
    await instance.client.connect();
    instance.db = await instance.client.db(dbName);
    //check for connection
    await instance.client.db(dbName).command({ping:1});
    console.log(`Connection Established to MongoDB:${dbName}`);
    instance.collection = await instance.db.collection(collName);
  }
  /**
   * Closes the connection, setting the instance to null
   */
  async close(){
    await instance.client.close();
    instance = null;
  }

  // Data Manipulation
  async readAll(){
    return await instance.collection.find().toArray();
  }
  async readByLocation(location){
    return await instance.collection.find({'location' : { $eq: location}}).toArray();
  }
  /**
   * inserts an object into the database
   * @param {JSON} event the data to be added
   */
  async create(event) {
    return await instance.collection.insertOne(event);
  }
  /**
   * inserts multiple objects into the database
   * @param {ArrayJSON} events the data to be added
   */
  async createMany(events) {
    return await instance.collection.insertMany(events);
  }
}

export const db = new DB();