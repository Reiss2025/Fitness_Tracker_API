//load dotenv
require('dotenv').config();

//Import express and cors
const express = require('express');
const cors = require('cors');

//create instance of express and define the port number
const app = express();
const port = 10120;

// Handle json data
app.use(express.json());

// Enable cors
app.use(cors());

// Link routes
const records = require('./route/RecordRoutes');
app.use('/records', records);

//Start server
app.listen(port, () => {
  console.log(`Server started on http://127.0.0.1:${port}/records/`);
})