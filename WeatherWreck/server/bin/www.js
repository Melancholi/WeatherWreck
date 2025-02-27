import app from '../api.mjs';
import {db} from '../db/db.mjs';

const port = process.env.PORT || 3001;


// Initialize the database and start the server
(async () => {
  try {
    // Connect to the database and open necessary collections
    await db.connect('WeatherWreck');
    await db.open('CarAccidents');
    await db.open('WeatherForecast');

    // Start the server once the database is ready
    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
    });

    // Handle graceful shutdown on SIGINT
    const shutdown = (signal) => {
      console.debug(`Signal ${signal} received, closing HTTP server`);
      server.close(() => {
        db.close();
        console.debug('HTTP server has been closed');
        process.exit(0);
      });
    };

    // Handle SIGINT (Ctrl+C) and SIGTERM (process termination)
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (e) {
    console.error('Could not connect');
    console.dir(e);
    process.exit();
  }
})();
