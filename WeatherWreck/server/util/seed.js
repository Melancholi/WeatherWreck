import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse';
import { db } from '../db/db.js';

const folderPath = path.join('./db', '/mockData');
const dbName = 'WeatherWreck';
const collections = ['CarAccidents', 'WeatherForecast'];
