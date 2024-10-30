import express from 'express';
import * as accidentController from '../controllers/accidentController.mjs';

const router = express.Router();

router.get('/', accidentController.getAccidents);
router.get('/state/:state', accidentController.getAccidentsByState);
router.get('/date/:date', accidentController.getAccidentsByDate);
router.get('/severity/:severity', accidentController.getAccidentsBySeverity);

export default router;