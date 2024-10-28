import express from 'express';
import accidentRouter from './routers/accidents.js';
import weatherRouter from './routers/weather.js';


const app = express();

//Serve the static files from the React app
app.use(express.static('./../client/dist'));
app.use('/api/accidents', accidentRouter);
app.use('/api/weather', weatherRouter);

//When data initialized start listening
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});