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
      return res.status(404).json({error: `No accidents found`});
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
    const data = await db.fetchEventsAndAccidents({ State: {$eq : state} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for ${state}`});
    }
    // Map each accident to include only AccidentID, Weather_Condition, and coordinates
    const simplifiedData = data.map(accident => ({
      AccidentID: accident.AccidentID,
      WeatheID: accident.WeatherID,
      WeatherCondition: accident.Weather_Condition,
      Coordinates: accident.Coordinates,
      State: accident.State
    }));

    res.status(200).json(simplifiedData);
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
    const data = await db.fetchEventsAndAccidents({ Date: {$eq : date} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for ${date}`});
    }
    // Map each accident to include only AccidentID, Weather_Condition, and coordinates
    const simplifiedData = data.map(accident => ({
      AccidentID: accident.AccidentID,
      WeatheID: accident.WeatherID,
      WeatherCondition: accident.Weather_Condition,
      Coordinates: accident.Coordinates,
      Date: accident.Date
    }));
    res.status(200).json(simplifiedData);
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
    const severity = req.params.severity;
    //Capitalize first letter
    const camelCaseType = severity[0].toUpperCase() + severity.slice(1);
    const data = await db.fetchEventsAndAccidents({ Severity: { $eq : camelCaseType} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for severity ${severity}`});
    }
    // Map each accident to include only AccidentID, Weather_Condition, and coordinates
    const simplifiedData = data.map(accident => ({
      AccidentID: accident.AccidentID,
      WeatheID: accident.WeatherID,
      WeatherCondition: accident.Weather_Condition,
      Coordinates: accident.Coordinates,
      WeatherSeverity: accident.Weather_Severity
    }));
    res.status(200).json(simplifiedData);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

export async function getAccidentsByType(req, res, next){
  try {
    const type = req.params.type;
    //Capitalize first letter
    const camelCaseType = type[0].toUpperCase() + type.slice(1);
    const data = await db.fetchEventsAndAccidents({ Type: { $eq : camelCaseType} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for type ${type}`});
    }
    // Map each accident to include only AccidentID, Weather_Condition, and coordinates
    const simplifiedData = data.map(accident => ({
      AccidentID: accident.AccidentID,
      WeatheID: accident.WeatherID,
      WeatherCondition: accident.Weather_Condition,
      Coordinates: accident.Coordinates,
    }));
    res.status(200).json(simplifiedData);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

export async function getAccidentDetails(req, res, next){
  try {
    const accidentId = req.params.accident_id; //A-3806044
    const weatherId = req.params.weather_id.toString(); //W-316042
    console.log(weatherId);
    const data = await db.fetchEventsAndAccidents({ Weather_Key: { $eq :weatherId} });

    if( data.length === 0){
      return res.status(404).json({error: `No details found for ${weatherId}`});
    }

    const filteredAccident = data.find( accident => accident.AccidentID === accidentId );

    if(!filteredAccident){
      return res.status(404).json({error: `Oupsy something went wrong for ${accidentId} `});
    }
    
    // Return the found accident
    res.status(200).json({
      WeatherCondition: filteredAccident.Weather_Condition,
      WeatherSeverity: filteredAccident.Weather_Severity,
      AccidentSeverity: filteredAccident.Accident_Severity,
      Description: filteredAccident.Description,
      State: filteredAccident.State,
      City: filteredAccident.City,
      Date: filteredAccident.Date
    });

  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}

