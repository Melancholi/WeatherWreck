import express from 'express';


const app = express();
const port = 3000;


//Serve the static files from the React app
app.use(express.static('./../client/dist'));

//When data initialized start listening
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});