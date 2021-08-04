const express = require('express');
const { dbConnection } = require('./db/config');
const cors = require('cors');
require('dotenv').config();

//Create express server
const app = express();

//Data Base
dbConnection();

//CORS
app.use(cors());

// Directory
app.use( express.static('public') );

//Parsing and Reading from body
app.use( express.json() );

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Listening request
const port = process.env.PORT;
app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
});