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
    app.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
    });

    // Handle graceful shutdown on SIGINT
    process.on('SIGINT', ()=>{
      console.debug('Signal received, closing HTTP server');
      app.close(() =>{
        db.close();
        console.debug('HTTP server has been closed');
      });
    });

  } catch (e) {
    console.error('Could not connect');
    console.dir(e);
    process.exit();
  }
})();