import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const dburl = process.env.ATLAS_URI;

let instance = null;

class DB{
  //Connecting the DB
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
  async create(event) {
    return await instance.collection.insertOne(event);
  }
  async createMany(event) {
    return await instance.collection.insertMany(event);
  }
}

export const db = new DB();