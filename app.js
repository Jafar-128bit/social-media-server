const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const {connectDB, getDb} = require('./config/databaseConfig');
const createCollections = require('./sechema/index');

const app = express();

const indexRouter = require('./routes/indexRoute');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

connectDB()
    .then(() => {
        createCollections(getDb);
        indexRouter(app, '/api/v1');
    })
    .catch(console.dir);

module.exports = app;
