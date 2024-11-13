import {db} from '../db/db.mjs';

/**
 * Retrieves all car accidents from the database and returns them in the response.
 * If no accidents are found, it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the accidents data or an error message.
 */
export async function getAccidents(req, res, next){
  try {
    const data = await db.generalFetchEventsAndAccidents();
    if (data.length === 0){
      return res.status(404).json({error: 'No accidents found'});
    }
    const simplifiedData = data.map(accident => ({
      AccidentID: accident.AccidentID,
      WeatheID: accident.WeatherID,
      WeatherCondition: accident.Weather_Condition,
      Coordinates: accident.Coordinates,
      Date: accident.Date,
      WeatherSeverity: accident.Weather_Severity,
      AccidentSeverity: accident.Accident_Severity
    }));
    res.status(200).json(simplifiedData);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieves car accidents by a specific U.S. state and returns them in the response.
 * If no accidents are found for the given state, it responds with a 404 status 
 * and an error message.
 * @async
 * @function
 * @param {Object} req - The request object containing a state parameter in the URL.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the accidents data or an error message.
 */
export async function getAccidentsByState(req, res, next){
  try {
    const state = req.params.state.toUpperCase();
    const data = await db.readByCondition('CarAccidents', { State: {$eq : state} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for ${state}`});
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}
/**
 * Retrieves car accidents by a specific date and returns them in the response.
 * If no accidents are found for the given date, it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object containing a date parameter in the URL.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the accidents data or an error message.
 */
export async function getAccidentsByDate(req, res, next){
  try {
    const date = req.params.date;
    const data = await db.readByCondition('CarAccidents', { Date: {$eq : date} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for ${date}`});
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message}));
  }
}
/**
 * Retrieves car accidents by severity level and returns them in the response.
 * If no accidents are found for the given severity, it responds with a 404 status 
 * and an error message.
 * @async
 * @function
 * @param {Object} req - The request object containing a severity parameter in the URL.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the accidents data or an error message.
 */
export async function getAccidentsBySeverity(req, res, next){
  try {
    const severity = req.params.severity.toLowerCase();
    const data = await db.readByCondition('CarAccidents', { Severity: { $eq : severity} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for severity ${severity}`});
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieves matched weather and accidents events from the database and
 * returns them in the response.
 * If no matches are found, then it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the matched weather and accidents 
 * events data or an error message.
 */
export async function getMatchedEvents(req, res, next) {
  try {
    const data = await db.generalFetchEventsAndAccidents();
    if( data.length === 0){
      return res.status(404).json({error: 'No matches found'});
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}
