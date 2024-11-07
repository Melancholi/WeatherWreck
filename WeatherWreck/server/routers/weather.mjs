import express from 'express';
import * as weatherController from '../controllers/weatherController.mjs';

const router = express.Router();

/**
 * @swagger
 * /api/weather:
 *   get:
 *     summary: Retrieve a list of all weather events
 *     description: Retrieve a list of weather events from MongoDb. Can be used to populate a list of fake car accidents when prototyping or testing an API
 *     responses:
 *       200:
 *         description: A list of weather events
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
 *                       _id:
 *                         type: string
 *                         description: The unique identifier for the weather event.
 *                         example: "67218f370de953c75e15551e"
 *                       State:
 *                         type: string
 *                         description: The state of the weather event.
 *                         example: "IL"
 *                       Date:
 *                         type: string
 *                         description: The date the weather event occurred.
 *                         example: "2022-09-08"
 *                       Type:
 *                         type: string
 *                         description: The type of weather event.
 *                         example: "Rainstorm"
 *                       Description:
 *                         type: string
 *                         description: A detailed description of the weather event.
 *                         example: "Heavy rainfall with strong winds."
 *                       Location:
 *                         type: string
 *                         description: The location where the event occurred.
 *                         example: "Chicago"
 *                       Severity:
 *                         type: string
 *                         description: The severity level of the weather event.
 *                         example: "High"
 *       404:
 *         description: No weather events found
 */
router.get('/', weatherController.getWeatherEvents);

/**
 * @swagger
 * /api/weather/state/{state}:
 *   get:
 *     summary: Retrieve weather events for a specific state
 *     description: Retrieve a list of weather events, for a specific state, from MongoDb. Can be used to populate a list of fake weather events when prototyping or testing an API
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
 *         description: A list of weather events for the specified state
 *       404:
 *         description: No weather evemts found for the state
 */
router.get('/state/:state', weatherController.getWeatherEventsByState);

/**
 * @swagger
 * /api/weather/date/{date}:
 *   get:
 *     summary: Retrieve weather events for a specific date
 *     description: Retrieve a list of weather events, for a specific date, from MongoDb. Can be used to populate a list of fake weather events when prototyping or testing an API
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: The date of the weather event in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: A list of weather events for the specified date
 *       404:
 *         description: No weather evemts found for the date
 */
router.get('/date/:date', weatherController.getWeatherEventsByDate);

/**
 * @swagger
 * /api/weather/type/{type}:
 *   get:
 *     summary: Retrieve weather events for a specific type
 *     description: Retrieve a list of weather events, for a specific type, from MongoDb. Can be used to populate a list of fake weather events when prototyping or testing an API
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of weather event (e.g., Rainstorm, Tornado, etc.)
 *     responses:
 *       200:
 *         description: A list of weather events for the specified type
 *       404:
 *         description: No weather evemts found for the type
 */
router.get('/type/:type', weatherController.getWeatherEventsByType);

export default router;