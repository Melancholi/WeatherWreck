import {db} from '../db/db.mjs';
const weatherColl = 'WeatherForecast';

/**
 * Retrieves all weather events from the database and returns them in the response.
 * If no events are found, it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the weather events data 
 * or an error message.
 */
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
/**
 * Retrieves weather events by a specific U.S. state and returns them in the response.
 * If no events are found for the given state, it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object containing a state parameter in the URL.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the weather events data or an error message.
 */
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
/**
 * Retrieves weather events by a specific date and returns them in the response.
 * If no events are found for the given date, it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object containing a date parameter in the URL.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the weather events data or an error message.
 */
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
/**
 * Retrieves weather events by type and returns them in the response.
 * Converts the type parameter to camel case (capitalized first letter) for consistent database 
 * querying.
 * If no events are found for the given type, it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object containing a type parameter in the URL.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - Returns a JSON response with the weather events data or 
 * an error message.
 */
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