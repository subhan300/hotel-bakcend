
'use strict';

const restaurants = require("./routes/restaurants")
const menu = require("./routes/restaurantMenus/")
const promotion = require("./routes/promotion")
const review = require("./routes/review")
const user = require("./routes/user")
const helperCollection=require("./routes/helperRoutes")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const popularRestaurant = require("./routes/popularRestaurant");
const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/restaurants/', restaurants);
app.use('/api/menu/', menu);
app.use('/api/promotion/', promotion);
app.use('/api/user/', user);
app.use('/api/review/', review);
app.use("/api/helper",helperCollection)
app.use("/api/popular",popularRestaurant)



module.exports = app;
