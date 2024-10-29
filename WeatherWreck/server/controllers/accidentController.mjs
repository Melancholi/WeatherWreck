import {db} from '../db/db.mjs';

export async function getAccidents(req, res, next){
  try {
    const accidents = await db.readAll('CarAccidents');
    if (accidents.length === 0){
      return res.status(404).json({error: `No accidents found`});
    }
    res.status(200).json(accidents);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}
export async function getAccidentsByState(req, res, next){
  try {
    const state = req.params.state.toUpperCase();
    const data = await db.readByCondition('CarAccidents', { State: {$eq : state} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for ${state}`});
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}
export async function getAccidentsByDate(req, res, next){
  try {
    const date = req.params.date;
    const data = await db.readByCondition('CarAccidents', { Date: {$eq : date} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for ${date}`});
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message}));
  }
}
export async function getAccidentsBySeverity(req, res, next){
  try {
    const severity = req.params.severity.toLowerCase();
    const data = await db.readByCondition('CarAccidents', { Severity: { $eq : severity} });
    if( data.length === 0){
      return res.status(404).json({error: `No accidents found for severity ${severity}`});
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error.message);
    next(res.status(500).json({ error: error.message }));
  }
}