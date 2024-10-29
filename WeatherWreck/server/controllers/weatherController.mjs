import {db} from '../db/db.mjs';
const weatherColl = 'WeatherForecast';
export async function getWeatherEvents(req, res){
  try {
    const data = await db.readAll(weatherColl);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getWeatherEventsByState(req, res){
  try {
    const state = req.params.state.toUpperCase();
    const data = await db.readByCondition(weatherColl, { State: {$eq : state}});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
export async function getWeatherEventsByDate(req, res){
  try{
    const date = req.params.date;
    const data = await db.readByCondition(weatherColl, {Date:{$eq :date}});
    res.status(200).json(data);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
}
export async function getWeatherEventsByType(req, res){
  try{
    const type = req.params.type.toLowerCase();
    //Capitalize first letter
    const camelCaseType = await type[0].toUpperCase() + type.slice(1);
    const data = db.readByCondition(weatherColl, {Type:{$eq :camelCaseType}});
    res.status(200).json(data);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
}