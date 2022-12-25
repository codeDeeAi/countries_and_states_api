const express = require('express');
const app = express();
require('dotenv').config();

const PORT = (process.env.PORT) ? process.env.PORT : 3000;
const RATE_LIMITER = require('./config/rate-limiter');

app.use('/api', RATE_LIMITER);
let routes = require('./routes/api/v1');
app.use(routes);



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})