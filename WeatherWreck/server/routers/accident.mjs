import express from 'express';
import * as accidentController from '../controllers/accidentController.mjs';

const router = express.Router();

/**
 * @swagger
 * /api/accidents:
 *   get:
 *     summary: Retrieve a list of all car accidents
 *     description: Retrieve a list of car accidents from MongoDb. Can be used to populate a list of fake car accidents when prototyping or testing an API
 *     responses:
 *       200:
 *         description: A list of car accidents
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
 *                         description: The unique identifier for the accident.
 *                         example: "67218f370de953c75e15551e"
 *                       ID:
 *                         type: string
 *                         description: The accident ID.
 *                         example: "A-512230"
 *                       State:
 *                         type: string
 *                         description: The state where the accident occurred.
 *                         example: "IL"
 *                       City:
 *                         type: string
 *                         description: The city where the accident occurred.
 *                         example: "Bartlett"
 *                       Severity:
 *                         type: string
 *                         description: The severity level of the accident.
 *                         example: "1"
 *                       Start_Time:
 *                         type: string
 *                         description: The start time of the accident.
 *                         example: "05:49:30"
 *                       End_Time:
 *                         type: string
 *                         description: The end time of the accident.
 *                         example: "06:34:53"
 *                       Description:
 *                         type: string
 *                         description: A description of the accident.
 *                         example: "Crash on CR-11 Army Trail Rd at IL-59."
 *                       Street:
 *                         type: string
 *                         description: The street where the accident occurred.
 *                         example: "Army Trail Rd"
 *                       Distance(mi):
 *                         type: number
 *                         description: The distance in miles where the accident took place.
 *                         example: 0.0
 *                       Weather_Condition:
 *                         type: string
 *                         description: The weather condition at the time of the accident.
 *                         example: "Cloudy"
 *                       Date:
 *                         type: string
 *                         description: The date the accident occurred.
 *                         example: "2022-09-08"
 *                       Start_Point:
 *                         type: array
 *                         items:
 *                           type: number
 *                         description: The coordinates for the start point of the accident.
 *                         example: [-88.208092, 41.946796]
 *                       End_Point:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: The coordinates for the end point of the accident.
 *                         example: ["", ""]
 *       404:
 *         description: No accidents found
 */
router.get('/', accidentController.getAccidents);

/**
 * @swagger
 * /api/accidents/state/{state}:
 *   get:
 *     summary: Retrieve car accidents for a specific state
 *     description: Retrieve a list of car accidents, for a specific state, from MongoDb. Can be used to populate a list of fake car accidents when prototyping or testing an API
 *     responses:
 *       200:
 *         description: A list of accidents for the specified state
 *       404:
 *         description: No accidents found for the state
 */
router.get('/state/:state', accidentController.getAccidentsByState);

/**
 * @swagger
 * /api/accidents/date/{date}:
 *   get:
 *     summary: Retrieve car accidents for a specific date
 *     description: Retrieve a list of car accidents, for a specific date, from MongoDb. Can be used to populate a list of fake car accidents when prototyping or testing an API
 *     responses:
 *       200:
 *         description: A list of accidents for the specified date
 *       404:
 *         description: No accidents found for the date
 */
router.get('/date/:date', accidentController.getAccidentsByDate);

/**
 * @swagger
 * /api/accidents/severity/{severity}:
 *   get:
 *     summary: Retrieve car accidents for a specific severity
 *     description: Retrieve a list of car accidents, for a specific severity, from MongoDb. Can be used to populate a list of fake car accidents when prototyping or testing an API
 *     responses:
 *       200:
 *         description: A list of accidents for the specified severity
 *       404:
 *         description: No accidents found for the severity
 */
router.get('/severity/:severity', accidentController.getAccidentsBySeverity);

export default router;