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

const csvFiles = await getFilePaths(folderPath);
const data = collections.map((coll, index) =>  ({
  'name': coll,
  'filePath': csvFiles[index]
}));

(async () =>{
  try{
    await db.connect(dbName);
    await Promise.all(data.map(collection => db.open(collection['name'])));

    await Promise.all(data.map(async(collection)=>{
      const dataToInsert = [];
      const fileContent = await fs.readFile(collection['filePath'], 'utf-8');

      await new Promise((resolve, reject) => {
        parse(fileContent, { 
          columns: true,
        }).
          on('data', (row) => dataToInsert.push(row)).
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
})();