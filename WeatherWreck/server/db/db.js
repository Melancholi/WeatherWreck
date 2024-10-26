import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const dburl = process.env.ATLAS_URI;
