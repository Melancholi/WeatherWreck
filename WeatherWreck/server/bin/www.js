import app from '../api.mjs';
import {db} from '../db/db.mjs';

const port = process.env.PORT || 3001;

//When data initialized start listening

(async () => {
  try {
    await db.connect('WeatherWreck');
    await db.open('WeatherForecast');
    await db.open('CarAccidents');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
    });

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