const express = require('express');
const app = express();
require('dotenv').config();

const PORT = (process.env.PORT) ? process.env.PORT : 3000;

let routes = require('./routes/api/v1');
app.use(routes);



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})