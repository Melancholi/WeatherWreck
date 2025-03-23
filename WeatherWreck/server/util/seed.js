import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse';
import { db } from './db.mjs';
import { getFilePaths, formatFile} from './utils.js';

const folderPath = path.join('./data');
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
      let rowsAdded = 0;
      //this csv-parse was based of onlines docs 
      await new Promise((resolve, reject) => {
        const parser = parse(fileContent, { 
          columns: true,
        });
        parser.
          on('data', (row) => {
            if(rowsAdded >= 1000){
              console.log('close');
              parser.destroy();
              resolve();
              return;
            }
            //format the data before sending
            const formatData = formatFile(row, collection['name']);
            dataToInsert.push(formatData);
            rowsAdded++;
          }).
          on('end', () => {
            console.log(`Finished parsing ${rowsAdded} rows.`);
            resolve();
          }).
          on('error', (err) => {
            console.error('Error while parsing:', err);
            reject(err);
          }).
          on('close', ()=>{
            console.log('closed?');
            resolve();
          });
      });
      await db.createMany(collection['name'],dataToInsert);
    }));
    await db.close();
    console.log('Database seeding completed.');
  }catch(e){
    console.error('Error seeding the database:', e);
    await db.close();
  }
};

seed();
