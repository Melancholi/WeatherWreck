import express from 'express';
import accidentRouter from './routers/accident.mjs';
import weatherRouter from './routers/weather.mjs';
import { db } from './db/db.mjs';
//Create APP
const app = express();

//Serve the static files from the React app
app.use(express.static('./../client/dist'));

// Route for accident-related API endpoints
app.use('/api/accidents', accidentRouter);

// Route for weather-related API endpoints
app.use('/api/weather', weatherRouter);

app.get('/test/:state', async (req, res, next) =>{
  try{
    const state = req.params.state.toUpperCase();
    const data = await db.readByConditionMatch('CarAccidents', 'WeatherForecast',
      { State: {$eq : state} });
    res.json(data);
  }catch(error){
    next(res.status(500).json({error : error.message}));
  }
});

export default app;