import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse';
import { db } from '../db/db.js';

const folderPath = path.join('./db', '/mockData');
const dbName = 'WeatherWreck';
const collections = ['CarAccidents', 'WeatherForecast'];

async function getFilePaths(folderPath) {
  try{
    const data = await fs.readdir(folderPath);
    return data.map(file => path.join(folderPath, file));
  }catch(e){
    console.error(e);
    return [];
  }
};
