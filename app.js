
'use strict';

const restaurants=require("./routes/restaurants")
const menu=require("./routes/restaurantMenus/")
const promotion=require("./routes/promotion")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
//   );
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//   next();
// });

// Routes
app.use('/api/restaurants/', restaurants);
app.use('/api/menu/', menu);
app.use('/api/promotion/', promotion);



module.exports = app;
