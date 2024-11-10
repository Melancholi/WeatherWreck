import express from 'express';
import accidentRouter from './routers/accident.mjs';
import weatherRouter from './routers/weather.mjs';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

//Create APP
const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'WeatherWreck API',
    version: '1.0.0',
    description: 'API documentation for the Weather and Accident information',
    license: {
      name: 'CC BY_NC_SA 4.0 - Attribution-Noncommercial-Sharelink 4.0 International',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
    }
  },
}

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routers/*.mjs", './controllers/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(options);

//Serve the static files from the React app
app.use(express.static('./../client/dist'));

// Route for accident-related API endpoints
app.use('/api/accidents', accidentRouter);

// Route for weather-related API endpoints
app.use('/api/weather', weatherRouter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app;