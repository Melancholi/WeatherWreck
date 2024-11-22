import express from 'express';
import * as accidentController from '../controllers/accidentController.mjs';

const router = express.Router();

/**
 * @swagger
 * /api/accidents:
 *   get:
 *     summary: Retrieve a list of all events of accidents and weather that were a match
 *     description: |
 *       Retrieve a list of all events of accidents and weather that were a match from MongoDb.<br> 
 *       Can be used to populate a list of fake events when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: |
 *           A list of events of accidents and weather that were a match.
 *           Here is an example of one event:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       AccidentID:
 *                         type: string
 *                         description: The accident ID.
 *                         example: "A-757778"
 *                       WeatherID:
 *                         type: string
 *                         description: The weather ID associated with the accident.
 *                         example: "W-291755"
 *                       WeatherCondition:
 *                         type: string
 *                         description: The weather condition at the time of the accident.
 *                         example: "Rain"
 *                       Coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         description: The coordinates where the accident occurred.
 *                         example: [-85.95401, 39.225426]
 *                       Date:
 *                         type: string
 *                         description: The date the accident occurred.
 *                         example: "2022-01-01"
 *                       WeatherSeverity:
 *                         type: string
 *                         description: The severity of the weather conditions during the accident.
 *                         example: "Light"
 *                       AccidentSeverity:
 *                         type: string
 *                         description: The severity level of the accident.
 *                         example: "3"
 *       404:
 *         description: No accidents found
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Events for matched accidents and weather
 */
router.get('/', accidentController.getAccidents);

/**
 * @swagger
 * /api/accidents/state/{state}:
 *   get:
 *     summary: |
 *      Retrieve a list of all events, for a specific state, of accidents and weather 
 *      that were a match
 *     description: |
 *       Retrieve a list of all events, for a specific state, of accidents and weather that
 *       were a match from MongoDb.<br>
 *       Can be used to populate a list of fake events when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: state
 *         required: true
 *         description: The state abbreviation (e.g., IL for Illinois).
 *         schema:
 *           type: string
 *           example: "IL"
 *     responses:
 *       200:
 *         description: |
 *           A list of all events, for a specific state, of accidents and weather that 
 *           were a match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       AccidentID:
 *                         type: string
 *                         description: The accident ID.
 *                         example: "A-757778"
 *                       WeatherID:
 *                         type: string
 *                         description: The weather ID associated with the accident.
 *                         example: "W-291755"
 *                       WeatherCondition:
 *                         type: string
 *                         description: The weather condition at the time of the accident.
 *                         example: "Rain"
 *                       Coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         description: The coordinates where the accident occurred.
 *                         example: [-85.95401, 39.225426]
 *                       State:
 *                         type: string
 *                         description: The state where the accident occurred.
 *                         example: "IL"
 *       404:
 *         description: No accidents found for `state`
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Events for matched accidents and weather
 */
router.get('/state/:state', accidentController.getAccidentsByState);

/**
 * @swagger
 * /api/accidents/date/{date}:
 *   get:
 *     summary: |
 *       Retrieve a list of all events, for a specific date, of accidents and weather that 
 *       were a match
 *     description: |
 *       Retrieve a list of all events, for a specific date, of accidents and weather that were 
 *       a match from MongoDb.<br>
 *       Can be used to populate a list of fake events when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: The date of the weather event in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: |
 *           A list of all events, for a specific date, of accidents and weather that were a match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       AccidentID:
 *                         type: string
 *                         description: The accident ID.
 *                         example: "A-757778"
 *                       WeatherID:
 *                         type: string
 *                         description: The weather ID associated with the accident.
 *                         example: "W-291755"
 *                       WeatherCondition:
 *                         type: string
 *                         description: The weather condition at the time of the accident.
 *                         example: "Rain"
 *                       Coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         description: The coordinates where the accident occurred.
 *                         example: [-85.95401, 39.225426]
 *                       Date:
 *                         type: string
 *                         description: The date when the accident occurred.
 *                         example: "2022-01-04"
 *       404:
 *         description: No accidents found for `date`
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Events for matched accidents and weather
 */
router.get('/date/:date', accidentController.getAccidentsByDate);

/**
 * @swagger
 * /api/accidents/severity/{severity}:
 *   get:
 *     summary: |
 *       Retrieve a list of all events, for a specific weather severity, of accidents and 
 *       weather that were a match
 *     description: |
 *       Retrieve a list of all events, for a specific weather severity, of accidents and 
 *       weather that were a match from MongoDb.<br>
 *       Can be used to populate a list of fake events when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: severity
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           The severity of the weather (e.g., Severe, Heavy, Moderate, Light, Other, UNK)
 *     responses:
 *       200:
 *         description: A list of events for the specified severity of the weather
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       AccidentID:
 *                         type: string
 *                         description: The accident ID.
 *                         example: "A-757778"
 *                       WeatherID:
 *                         type: string
 *                         description: The weather ID associated with the accident.
 *                         example: "W-291755"
 *                       WeatherCondition:
 *                         type: string
 *                         description: The weather condition at the time of the accident.
 *                         example: "Rain"
 *                       Coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         description: The coordinates where the accident occurred.
 *                         example: [-85.95401, 39.225426]
 *                       WeatherSeverity:
 *                         type: string
 *                         description: The severity of the weather when the accident occurred.
 *                         example: "Light"
 *       404:
 *         description: No accidents found for severity `severity`
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Events for matched accidents and weather
 */
router.get('/severity/:severity', accidentController.getAccidentsBySeverity);

/**
 * @swagger
 * /api/accidents/type/{type}:
 *   get:
 *     summary: |
 *       Retrieve a list of all events, for a specific type, of accidents and weather that 
 *       were a match
 *     description: |
 *       Retrieve a list of all events, for a specific date, of accidents and weather that 
 *       were a match from MongoDb.<br> 
 *       Can be used to populate a list of fake events when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           The severity of the weather (e.g., Severe, Heavy, Moderate, Light, Other, UNK)
 *     responses:
 *       200:
 *         description: A list of accidents for the specified severity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       AccidentID:
 *                         type: string
 *                         description: The accident ID.
 *                         example: "A-757778"
 *                       WeatherID:
 *                         type: string
 *                         description: The weather ID associated with the accident.
 *                         example: "W-291755"
 *                       WeatherCondition:
 *                         type: string
 *                         description: The weather condition at the time of the accident.
 *                         example: "Rain"
 *                       Coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         description: The coordinates where the accident occurred.
 *                         example: [-85.95401, 39.225426]
 *       404:
 *         description: No accidents found for the type `type`
 *       500:
 *         description: Internal server error
 *     tags:
 *       - Events for matched accidents and weather
 */
router.get('/type/:type', accidentController.getAccidentsByType);

/**
 * @swagger
 * /api/accidents/details/{accident_id}/{weather_id}:
 *   get:
 *     summary: Retrieve detailed information about a specific accident
 *     description: |
 *       Retrieves detailed information about a specific accident event based on the 
 *       provided `accident_id` and `weather_id`.<br> 
 *       This includes weather conditions, accident severity, and other relevant 
 *       details (e.g., description, state, city, and date).
 *     parameters:
 *       - in: path
 *         name: accident_id
 *         required: true
 *         description: The unique identifier of the accident.
 *         schema:
 *           type: string
 *       - in: path
 *         name: weather_id
 *         required: true
 *         description: The unique identifier of the weather event associated with the accident.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A detailed object containing the accident information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 WeatherCondition:
*                    type: string
*                    description: The weather condition at the time of the accident.
*                    example: "Rain"
 *                 WeatherSeverity:
 *                   type: string
 *                   description: The severity of the weather when the accident occurred.
 *                   example: "Light"
 *                 AccidentSeverity:
 *                   type: string
 *                   description: The severity level of the accident.
 *                   example: "3"
 *                 Description:
 *                   type: string
 *                   description: A description of the accident.
 *                   example: "The accident was bad!"
 *                 State:
 *                   type: string
 *                   description: The state where the accident occurred.
 *                   example: "IL"
 *                 City:
 *                   type: string
 *                   description: The city where the accident occurred.
 *                   example: "Chicago"
 *                 Date:
 *                   type: string
 *                   description: The date when the accident occurred.
 *                   example: "2022-01-04"
 *       404:
 *         description: |
 *           If `weather_id` is wrong: No details found for `weather_id`<br>
 *           If `accidnet_id` is wrong: Oupsy something went wrong for `accidnet_id`
 *       500:
 *         description: Internal server error.
 *     tags:
 *       - Events for matched accidents and weather
 */
router.get('/details/:accident_id/:weather_id', accidentController.getAccidentDetails);

export default router;