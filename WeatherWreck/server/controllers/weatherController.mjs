import {db} from '../db/db.mjs';
const weatherColl = 'WeatherForecast';
export async function getWeatherEvents(req, res, next){
  try {
    const data = await db.readAll(weatherColl);
    if( data.length === 0){
      return res.status(404).json({error: `No weather events were found`});
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}
export async function getWeatherEventsByState(req, res, next){
  try {
    const state = req.params.state.toUpperCase();
    const data = await db.readByCondition(weatherColl, { State: {$eq : state}});
    if( data.length === 0){
      return res.status(404).json({error: `No weather events were found for ${state}`});
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}
export async function getWeatherEventsByDate(req, res, next){
  try{
    const date = req.params.date;
    const data = await db.readByCondition(weatherColl, {Date:{$eq :date}});
    if( data.length === 0){
      return res.status(404).json({error: `No weather events were found for ${date}`});
    }
    res.status(200).json(data);
  }catch(error){
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}
export async function getWeatherEventsByType(req, res, next){
  try{
    const type = req.params.type.toLowerCase();
    //Capitalize first letter
    const camelCaseType = await type[0].toUpperCase() + type.slice(1);
    const data = db.readByCondition(weatherColl, {Type:{$eq :camelCaseType}});
    if( data.length === 0){
      return res.status(404).json({error: `No weather events were found for ${type}`});
    }
    res.status(200).json(data);
  }catch(error){
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}