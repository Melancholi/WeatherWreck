import {db} from '../db/db.js';

export async function getWeatherEvents(req,res){
  const data = await db.readAll('WeatherForcast');
  res.json(data);
}
export async function getWeatherEventsByState(req,res){
  const state = req.params.state.toLowerCase();
  //Capitalize first letter
  const camelCaseState = state[0].toUpperCase() + state.slice(1);
  const data = await db.readByCondition('WeatherForcast', {State:{camelCaseState}})
  res.json(data);

}
export async function getWeatherEventsByDate(req,res){
  const date = req.params.date;
  const data = await db.readByCondition('WeatherForcast', {Date:{date}})
  res.json(data);
}
export async function getWeatherEventsByType(req,res){
  const type = req.params.type.toLowerCase();
  //Capitalize first letter
  const camelCaseType = await state[0].toUpperCase() + state.slice(1);
  const data = db.readByCondition('WeatherForcast', {Type:{camelCaseType}})
  res.json(data);
}