

'use strict';
const mongoose = require('mongoose');
const app = require('./app');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const port = 3977;
// mongodb://0.0.0.0:27017/clothingcompany
const DB ="mongodb://localhost:27017/restaurant_management" ||  process.env.CONNECTION_STRING;

mongoose
  .connect(DB)
  .then(() => {
    try {
      console.log('connection successfully !');
      http.createServer(app).listen(process.env.PORT || { port }, console.log(`Server is running on the port no: ${port} `));
    } catch (err) {
      console.log('err', err);
    }
  })
  .catch((err) => {
    console.log('err', err);
  });
