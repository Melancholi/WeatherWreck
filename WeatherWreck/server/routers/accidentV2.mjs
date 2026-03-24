import express from 'express';
import * as accidentController from '../controllers/accidentControllerV2.mjs';

const router = express.Router();

/**
 * @swagger
 * /api/v2/accidents:
 *   get:
 *     summary: Retrieve all accidents with pagination support
 *     description: |
 *       Retrieve events of accidents and weather that were a match with pagination.
 *       Supports both offset/limit and cursor-based pagination.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of results per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip (for offset pagination)
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor token for cursor-based pagination
 *     responses:
 *       200:
 *         description: A list of formatted accidents with pagination metadata
 *       404:
 *         description: No accidents found
 *       500:
 *         description: Internal server error
 *     tags:
 *       - V2 Accidents (with Pagination)
 */
router.get('/', accidentController.getAccidents);

/**
 * @swagger
 * /api/v2/accidents/state/{state}:
 *   get:
 *     summary: Retrieve accidents by state with pagination
 *     parameters:
 *       - in: path
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: State abbreviation (e.g., CA)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Accidents for the specified state with pagination
 *       404:
 *         description: No accidents found for this state
 *       500:
 *         description: Internal server error
 *     tags:
 *       - V2 Accidents (with Pagination)
 */
router.get('/state/:state', accidentController.getAccidentsByState);

/**
 * @swagger
 * /api/v2/accidents/date/{date}:
 *   get:
 *     summary: Retrieve accidents by date with pagination
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Date in YYYY-MM-DD format
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Accidents for the specified date with pagination
 *       404:
 *         description: No accidents found for this date
 *       500:
 *         description: Internal server error
 *     tags:
 *       - V2 Accidents (with Pagination)
 */
router.get('/date/:date', accidentController.getAccidentsByDate);

/**
 * @swagger
 * /api/v2/accidents/severity/{severity}:
 *   get:
 *     summary: Retrieve accidents by weather severity with pagination
 *     parameters:
 *       - in: path
 *         name: severity
 *         required: true
 *         schema:
 *           type: string
 *         description: Severity level (low, moderate, high)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Accidents with the specified severity with pagination
 *       404:
 *         description: No accidents found for this severity
 *       500:
 *         description: Internal server error
 *     tags:
 *       - V2 Accidents (with Pagination)
 */
router.get('/severity/:severity', accidentController.getAccidentsBySeverity);

/**
 * @swagger
 * /api/v2/accidents/type/{type}:
 *   get:
 *     summary: Retrieve accidents by weather type with pagination
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Weather type (e.g., rain, snow)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Accidents with the specified weather type with pagination
 *       404:
 *         description: No accidents found for this type
 *       500:
 *         description: Internal server error
 *     tags:
 *       - V2 Accidents (with Pagination)
 */
router.get('/type/:type', accidentController.getAccidentsByType);

/**
 * @swagger
 * /api/v2/accidents/details/{accidentID}/{weatherID}:
 *   get:
 *     summary: Retrieve detailed information for a specific accident
 *     parameters:
 *       - in: path
 *         name: accidentID
 *         required: true
 *         schema:
 *           type: string
 *         description: Accident ID
 *       - in: path
 *         name: weatherID
 *         required: true
 *         schema:
 *           type: string
 *         description: Weather ID
 *     responses:
 *       200:
 *         description: Detailed information about the accident
 *       404:
 *         description: Accident or weather details not found
 *       500:
 *         description: Internal server error
 *     tags:
 *       - V2 Accidents (with Pagination)
 */
router.get('/details/:accident_id/:weather_id', accidentController.getAccidentDetails);

export default router;
