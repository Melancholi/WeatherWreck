import {db} from '../db/db.js';

export async function getAccidents(req, res){
  try {
    const accidents = await db.readAll('CarAccidents');
    res.json(accidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getAccidentsByState(req, res){
  try {
    const state = req.params.state.toLowerCase();
    const camelCaseState = state[0].toUpperCase() + state.slice(1);
    const data = await db.readByCondition('CarAccidents', { State: camelCaseState });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getAccidentsByDate(req, res){
  try {
    const date = req.params.date;
    const data = await db.readByCondition('CarAccidents', { Date: date });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getAccidentsBySeverity(req, res){
  try {
    const severity = req.params.severity.toLowerCase();
    const camelCaseSeverity = severity[0].toUpperCase() + severity.slice(1);
    const data = await db.readByCondition('CarAccidents', { Severity: camelCaseSeverity });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}