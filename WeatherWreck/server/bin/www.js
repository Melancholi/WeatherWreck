import app from '../api.mjs';
import {db} from '../db/db.mjs';
import {db as dbv2} from '../db/dbv2.mjs';

const port = process.env.PORT || 3001;


// Initialize the database and start the server
(async () => {
  try {
    // Connect to V1 database
    await db.connect('WeatherWreck');
    await db.open('CarAccidents');
    await db.open('WeatherForecast');

    // Connect to V2 database (optimized version)
    await dbv2.connect('WeatherWreck');
    await dbv2.open('CarAccidents');
    await dbv2.open('WeatherForecast');

    // Start the server once databases are ready
    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
    });

    // Handle graceful shutdown on SIGINT
    const shutdown = (signal) => {
      console.log(`\nSignal ${signal} received, closing HTTP server`);
      server.close(() => {
        db.close();
        dbv2.close();
        console.log('HTTP server has been closed');
        process.exit(0);
      });
    };

    // Handle SIGINT (Ctrl+C) and SIGTERM (process termination)
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (e) {
    console.error('Could not connect to database');
    console.error(e);
    process.exit(1);
  }
})();
