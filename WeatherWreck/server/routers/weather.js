import express from 'express';
import * as weatherController from '../controllers/weatherController.js';

const router = express.Router();

router.get('/', weatherController.getWeatherEvents);
router.get('/:state', weatherController.getWeatherEventsByState);
router.get('/:date', weatherController.getWeatherEventsByDate);
router.get('/:type', weatherController.getWeatherEventsByType);

export default router;