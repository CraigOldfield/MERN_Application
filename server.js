const express = require('express');
const mongoose = require('mongoose');

const items = require('./routes/api/items');

const app = express();

//Adding ability to parse the request body
app.use(express.json());

//Database Config File
const db = require('./config/keys').mongoURI;

//Connecting to Mongo
mongoose 
    .connect(db, { useNewUrlParser: true }) 
    .then(() => console.log("MongoDB Connected...")) 
    .catch(err => console.log(err));

//Routes
app.use('/api/items', items);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));