'use strict';

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const teamsRouter = require('./routes/teams');

const dbName = 'Quizzer';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ origin: true, credentials: true }));

app.use(bodyParser.json());

app.use('/', teamsRouter);

const server = app.listen(3000, () => {
    mongoose.connect(`mongodb://localhost:27017/${dbName}`,  {useNewUrlParser: true }, () => {
        console.log(`quizzer team server started on port ${server.address().port}`);
    });
});