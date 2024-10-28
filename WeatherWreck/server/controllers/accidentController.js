import {db} from '../db/db.js';

export async function getAccidents(req, res){
  const accidents = await db.readAll('CarAccidents');
  res.json( accidents);
}
export async function getAccidentsByState(req, res){
  const state = req.params.state.toLowerCase();
  //Capitalize first letter
  const camelCaseState = state[0].toUpperCase() + state.slice(1);
  const data = await db.readByCondition('CarAccidents', {State:{camelCaseState}})
  res.json(data);
}
export async function getAccidentsByDate(req, res){
  const date = req.params.date;
  const data = await db.readByCondition('CarAccidents', {Date:{date}})
  res.json(data);
}
export async function getAccidentsBySeverity(req, res){
  const severity = req.params.severity.toLowerCase();
  //Capitalize first letter
  const camelCaseType = state[0].toUpperCase() + state.slice(1);
  const data = await db.readByCondition('CarAccidents', {Type:{camelCaseType}})
  res.json(data);
}