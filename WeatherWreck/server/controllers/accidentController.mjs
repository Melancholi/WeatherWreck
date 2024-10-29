import {db} from '../db/db.mjs';

export async function getAccidents(req, res){
  try {
    const accidents = await db.readAll('CarAccidents');
    res.status(200).json(accidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getAccidentsByState(req, res){
  try {
    const state = req.params.state.toUpperCase();
    const data = await db.readByCondition('CarAccidents', { State: {$eq : state} });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getAccidentsByDate(req, res){
  try {
    const date = req.params.date;
    const data = await db.readByCondition('CarAccidents', { Date: {$eq : date} });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getAccidentsBySeverity(req, res){
  try {
    const severity = req.params.severity.toLowerCase();
    const data = await db.readByCondition('CarAccidents', { Severity: { $eq : severity} });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}