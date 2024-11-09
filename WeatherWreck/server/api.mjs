import express from 'express';
import accidentRouter from './routers/accident.mjs';
import weatherRouter from './routers/weather.mjs';
//Create APP
const app = express();

//Serve the static files from the React app
app.use(express.static('./../client/dist'));

// Route for accident-related API endpoints
app.use('/api/accidents', accidentRouter);

// Route for weather-related API endpoints
app.use('/api/weather', weatherRouter);

export default app;