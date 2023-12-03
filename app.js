
'use strict';

const restaurants=require("./routes/restaurants")
const menu=require("./routes/restaurantMenus/")
const promotion=require("./routes/promotion")
const user=require("./routes/user")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/restaurants/', restaurants);
app.use('/api/menu/', menu);
app.use('/api/promotion/', promotion);
app.use('/api/user/', user);



module.exports = app;
