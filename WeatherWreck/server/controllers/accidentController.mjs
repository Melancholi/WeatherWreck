import {db} from '../db/db.mjs';
import cache from 'memory-cache';

/**
 * Retrieve all events of accidents and weather that were a match, from the database, 
 * and returns them in the response.
 * If no event is found, it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the events data or an error message.
 */
export async function getAccidents(req, res, next){
  try {
    const cacheKey = 'all_accidents';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Cache was hit for all accidents');
      return res.status(200).json(cachedData);
    }

    const data = await db.generalFetchEventsAndAccidents();
    if (data.length === 0){
      return res.status(404).json({error: 'No accidents found'});
    }
    // Data is already formatted by database aggregation pipeline
    cache.put(cacheKey, data);
    res.set({'Cache-Control': 'max-age=31536000'}); 
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieve, based on a specific U.S. state, all events of accidents and weather that were a 
 * match, from the database, and returns them in the response.
 * If no event is found for the given state, it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the events data or an error message.
 */
export async function getAccidentsByState(req, res, next){
  try {
    const state = req.params.state.toUpperCase();
    const cacheKey = `state_accidents_${state}`; 
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache was hit for state ${state}`);
      return res.status(200).json(cachedData); 
    }

    const data = await db.fetchEventsAndAccidents({ State: {$eq : state} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for ${state}`});
    }
    // Data is already formatted by database aggregation pipeline
    cache.put(cacheKey, data);
    res.set({'Cache-Control': 'max-age=31536000'}); 
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieve, based on a specific date, all events of accidents and weather that were a 
 * match, from the database, and returns them in the response.
 * If no event is found for the given date, it responds with a 404 status and an error message.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the events data or an error message.
 */
export async function getAccidentsByDate(req, res, next){
  try {
    const date = req.params.date;
    const cacheKey = `state_accidents_${date}`; 
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache was hit for date ${date}`);
      return res.status(200).json(cachedData); 
    }

    const data = await db.fetchEventsAndAccidents({ Date: {$eq : date} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for ${date}`});
    }
    // Data is already formatted by database aggregation pipeline
    cache.put(cacheKey, data);
    res.set({'Cache-Control': 'max-age=31536000'}); 
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message}));
  }
}

/**
 * Retrieve, based on a specific weather severity, all events of accidents and weather that 
 * were a match, from the database, and returns them in the response.
 * If no event is found for the given weather severity, it responds with a 404 status and an 
 * error message.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the events data or an error message.
 */
export async function getAccidentsBySeverity(req, res, next){
  try {
    const severity = req.params.severity;
    //Capitalize first letter
    const camelCaseSeverity = severity[0].toUpperCase() + severity.slice(1);
    const cacheKey = `state_accidents_${camelCaseSeverity}`; 
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache was hit for severity ${camelCaseSeverity}`);
      return res.status(200).json(cachedData); 
    }

    const data = await db.fetchEventsAndAccidents({ Severity: { $eq : camelCaseSeverity} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for severity ${severity}`});
    }
    // Data is already formatted by database aggregation pipeline
    cache.put(cacheKey, data);
    res.set({'Cache-Control': 'max-age=31536000'}); 
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieve, based on a specific type of weather, all events of accidents and weather that 
 * were a match, from the database, and returns them in the response.
 * If no event is found for the given type of weather, it responds with a 404 status and an 
 * error message.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the events data or an error message.
 */
export async function getAccidentsByType(req, res, next){
  try {
    const type = req.params.type;
    //Capitalize first letter
    const camelCaseType = type[0].toUpperCase() + type.slice(1);
    const cacheKey = `state_accidents_${camelCaseType}`; 
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache was hit for weather type ${camelCaseType}`);
      return res.status(200).json(cachedData); 
    }
    const data = await db.fetchEventsAndAccidents({ Type: { $eq : camelCaseType} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for type ${type}`});
    }
    // Data is already formatted by database aggregation pipeline
    cache.put(cacheKey, data);
    res.set({'Cache-Control': 'max-age=31536000'}); 
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

/**
 * Retrieve detailed information about a sepcific accident, based on an accident_id and 
 * weather_id, from the database, and returns them in the response.
 * If no weather event is found for the given id, it responds with a 404 status and an 
 * error message.
 * If no accident is found for the given id, it responds with a 404 status and an error 
 * message.
 * 
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - Returns a JSON response with the events data or an error message.
 */
export async function getAccidentDetails(req, res, next){
  try {
    const accidentId = req.params.accident_id; 
    const weatherId = req.params.weather_id;
    const cacheKey = `state_accidents_${accidentId}_${weatherId}`; 
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache was hit for accident ${accidentId}`);
      return res.status(200).json(cachedData); 
    }

    const data = await db.fetchEventsAndAccidents({ 'Weather_Key': { $eq : weatherId} });
    if( data.length === 0){
      return res.status(404).json({error: `No details found for ${weatherId}`});
    }

    const filteredAccident = data.find( accident => accident.AccidentID === accidentId );

    if(!filteredAccident){
      return res.status(404).json({error: `Oupsy something went wrong for ${accidentId} `});
    }
    // Data is already formatted by database aggregation pipeline
    cache.put(cacheKey, filteredAccident);
    res.set({'Cache-Control': 'max-age=31536000'}); 
    res.status(200).json(filteredAccident);

  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

