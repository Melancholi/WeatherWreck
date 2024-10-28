import express from 'express';
import * as accidentController from '../controllers/accidentController.js';

const router = express.Router();

router.get('/', accidentController.getAccidents);
router.get('/state', accidentController.getAccidentsByState);
router.get('/date', accidentController.getAccidentsByDate);
router.get('/severity', accidentController.getAccidentsBySeverity);

export default router;