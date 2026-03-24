import express from 'express';
import accidentRouter from './routers/accident.mjs';
import accidentRouterV2 from './routers/accidentV2.mjs';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import compression from 'compression';

//Create APP
const app = express();

// Enable Gzip compression
app.use(compression());

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
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routers/*.mjs', './controllers/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(options);

//Serve the static files from the React app
app.use(express.static('./../client/dist', {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache'); 
    }
  },
  maxAge: '1y', 
}));

// Route for accident-related API endpoints (v1)
app.use('/api/v1/accidents', accidentRouter);

// Route for accident-related API endpoints (v2) with pagination
app.use('/api/v2/accidents', accidentRouterV2);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;