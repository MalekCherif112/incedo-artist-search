import express from 'express';

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const { PORT = 3000 } = process.env;
const artistRouter = require('./artist/routes/artist.routes');

app.use('/artist', artistRouter);

app.listen(PORT, () => {
    console.log('server started at http://localhost:'+ PORT);
});