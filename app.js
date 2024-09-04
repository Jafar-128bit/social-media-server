const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const {connectDB, getDb} = require('./config/databaseConfig');
const createCollections = require('./sechema/index');

const app = express();

const initializeRoutes = require('./routes/indexRoute');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Function to initialize the app
const initializeApp = async () => {
    try {
        await connectDB();
        await createCollections(getDb);
        await initializeRoutes(app, '/api/v1');
        console.error("Database is now connected!");
    } catch (err) {
        console.error("Failed to initialize the application:", err);
        process.exit(1); // Exit the process with a failure code
    }
};

initializeApp();

module.exports = app;
