

// 'use strict';
// const mongoose = require('mongoose');
// const app = require('./app');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const http = require('http');
// require("./sheduler")
// const dotenv = require('dotenv');
// dotenv.config();
// const port = 3977;
// const DB =process.env.CONNECTION_STRING;
// // mongodb://localhost:27017/restaurant_management" ||  
// const db = DB.db('restaurant_management');

// mongoose
//   .connect(DB,{serverSelectionTimeoutMS: 30000})
//   .then(() => {
//     try {
//       console.log('connection successfully !');
//       http.createServer(app).listen(process.env.PORT || { port }, console.log(`Server is running on the port no: ${port} `));
//       db.collection("restaurants").createIndex({ name: "text", description: "text" });
//     } catch (err) {
//       console.log('err', err);
//     }
//   })
//   .catch((err) => {
//     console.log('err', err);
//   });
'use strict';
const mongoose = require('mongoose');
const app = require('./app');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
require("./sheduler")
const dotenv = require('dotenv');
dotenv.config();
const port = 3977;
const DB = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/restaurant_management';
const db = mongoose.connection;

mongoose.connect(DB)
  .then(() => {
    try {
      console.log('Connection successful!');
      const server = http.createServer(app);
      server.listen(process.env.PORT || port, () => {
        console.log(`Server is running on port ${port}`);
      });

      mongoose.set('autoIndex', false);
    } catch (err) {
      console.log('Error:', err);
    }
  })
  .catch((err) => {
    console.log('Error connecting to the database:', err);
  });
