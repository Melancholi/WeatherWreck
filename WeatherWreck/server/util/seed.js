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

/**
 * Formats the data before sending to the data base for ease of use
 * formats depending on the type
 */
function formatFile(row, type){
  let formatData;
  if(type.includes('CarAccidents')){
    const startPoint = [row.Start_Lng, row.Start_Lat];
    const endPoint = [row.End_Lng, row.End_lat];
    row['Date'] = row.Start_Time.split(' ')[0];
    row['Start_Time'] = row.Start_Time.split(' ')[1];
    row['End_Time'] = row.End_Time.split(' ')[1];
    //remove now useless rows
    delete row['Start_Lat']
    delete row['Start_Lng']
    delete row['End_lat']
    delete row['End_Lng']
    formatData = {  
      ...row,
      'Start_Point': startPoint,
      'End_Point': endPoint,
    };
  }else{
        //remove now useless rows
    delete row["LocationLng"];
    delete row["LocationLat"];
    row['Date'] = row["StartTime(UTC)"].split(' ')[0];
    row['StartTime(UTC)'] = row["StartTime(UTC)"].split(' ')[1];
    row["EndTime(UTC)"] = row["EndTime(UTC)"].split(' ')[1];
    formatData = {
      ...row
    }
  }
  return formatData;
}
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