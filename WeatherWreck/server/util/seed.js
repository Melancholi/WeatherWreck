import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse';
import { db } from '../db/db.mjs';

const folderPath = path.join('./db', '/mockData');
const dbName = 'WeatherWreck';
const collections = ['CarAccidents', 'WeatherForecast'];

export async function getFilePaths(folderPath) {
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
export function formatFile(row, type){
  //encoding issues with the file, id had has a weirdly enconded
  //  character that makes it unable to access
  //  I just decided to do the simple 
  // option to get the id
  const idKey = Object.keys(row)[0];
  let formatData;
  if(type.includes('CarAccidents')){
    //encoding issues with the file, id had has a weirdly enconded
    //  character that makes it unable to access
    //  I just decided to do the simple 
    // option to get the id
    row['Start_Point'] = [row.Start_Lng, row.Start_Lat];
    row['End_Point'] = [row.End_Lng, row.End_Lat];
    row['Date'] = row.Start_Time.split(' ')[0];
    row['Start_Time'] = row.Start_Time.split(' ')[1];
    //fix a small issue due to time being 00:00:00
    row['End_Time'] = row['End_Time'].split(' ')[1] === '00:00:00'
      ? '23:59:59' : row['End_Time'].split(' ')[1];
    row['Accident_Key'] = row[idKey];
    delete row[idKey];
    //remove now useless rows
    delete row['Start_Lat'];
    delete row['Start_Lng'];
    delete row['End_Lat'];
    delete row['End_Lng'];
    formatData = {  
      ...row,
    };
  }else{
    //remove now useless rows
    delete row['LocationLng'];
    delete row['LocationLat'];
    row['Date'] = row['StartTime(UTC)'].split(' ')[0];
    row['StartTime(UTC)'] = row['StartTime(UTC)'].split(' ')[1];
    //fix a small issue due to time being 00:00:00
    row['EndTime(UTC)'] = row['EndTime(UTC)'].split(' ')[1] === '00:00:00'
      ? '23:59:59' : row['EndTime(UTC)'].split(' ')[1];
    row['Weather_Key'] = row[idKey];
    delete row[idKey];
    formatData = {
      ...row,
    };
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
})();