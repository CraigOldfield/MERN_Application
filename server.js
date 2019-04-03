const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const items = require('./routes/api/items');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');

const app = express();

//Adding ability to parse the request body
app.use(express.json());

//Database Config File
const db = config.get('mongoURI');

//Connecting to Mongo
mongoose 
    .connect(db, { 
        useNewUrlParser: true,
        useCreateIndex: true 
    }) 
    .then(() => console.log("MongoDB Connected...")) 
    .catch(err => console.log(err));

//Routes
app.use('/api/items', items);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));