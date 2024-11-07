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
router.get('/state/:state', weatherController.getWeatherEventsByState);
router.get('/date/:date', weatherController.getWeatherEventsByDate);
router.get('/type/:type', weatherController.getWeatherEventsByType);

export default router;