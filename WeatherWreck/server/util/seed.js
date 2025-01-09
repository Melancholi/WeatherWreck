import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse';
import { db } from '../db/db.mjs';
import { getFilePaths, formatFile} from './utils.js';

const folderPath = path.join('./db', '/mockData');
const dbName = 'WeatherWreck';
const collections = ['CarAccidents', 'WeatherForecast'];

const csvFiles = await getFilePaths(folderPath);
const data = collections.map((coll, index) =>  ({
  'name': coll,
  'filePath': csvFiles[index]
}));

const seed = async () =>{
  try{
    await db.connect(dbName);
    //open the collections
    await Promise.all(data.map(collection => db.open(collection['name'])));

    //start the process of passing csv data to mongodb
    await Promise.all(data.map(async(collection)=>{
      const dataToInsert = [];
      const fileContent = await fs.readFile(collection['filePath'], {encoding: 'utf-8'});
      //this csv-parse was based of onlines docs 
      await new Promise((resolve, reject) => {
        parse(fileContent, { 
          columns: true,
        }).
          on('data', (row) => {
            //format the data before sending
            const formatData = formatFile(row, collection['name']);
            dataToInsert.push(formatData);
          }).
          on('end', resolve).
          on('error', reject); 
      });
      await db.createMany(collection['name'], dataToInsert);
    }));
    await db.close();
    console.log('Database seeding completed.');
  }catch(e){
    console.error('Error seeding the database:', e);
    await db.close();
  }
};

seed();