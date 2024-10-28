import app from '../api.mjs';
c
 const port = process.env.PORT || 3001;

//When data initialized start listening
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});