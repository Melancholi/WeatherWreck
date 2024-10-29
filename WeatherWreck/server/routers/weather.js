import express from 'express';
import * as weatherController from '../controllers/weatherController.js';

const router = express.Router();

router.get('/', weatherController.getWeatherEvents);
router.get('/state/:state', weatherController.getWeatherEventsByState);
router.get('/date/:date', weatherController.getWeatherEventsByDate);
router.get('/type/:type', weatherController.getWeatherEventsByType);

export default router;