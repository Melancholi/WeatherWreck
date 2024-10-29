import {db} from '../db/db.js';

export async function getWeatherEvents(req,res){
  try {
    const data = await db.readAll('WeatherForcast');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getWeatherEventsByState(req,res){
  try {
    const state = req.params.state.toLowerCase();
    const camelCaseState = state[0].toUpperCase() + state.slice(1);
    const data = await db.readByCondition('WeatherForcast', { State: camelCaseState });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
export async function getWeatherEventsByDate(req,res){
  try{
    const date = req.params.date;
    const data = await db.readByCondition('WeatherForcast', {Date:{date}})
    res.json(data);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
}
export async function getWeatherEventsByType(req,res){
  try{
  const type = req.params.type.toLowerCase();
  //Capitalize first letter
  const camelCaseType = await state[0].toUpperCase() + state.slice(1);
  const data = db.readByCondition('WeatherForcast', {Type:{camelCaseType}});
  res.json(data);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
}