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
}
